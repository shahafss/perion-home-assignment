import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { UserService } from '../users/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PublicUser } from './interfaces/public-user.interface';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signup(email: string, password: string): Promise<PublicUser> {
    const normalizedEmail = this.normalizeEmail(email);
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userService.create(
      { name: normalizedEmail, email: normalizedEmail },
      passwordHash
    );
    return this.toPublicUser(user);
  }

  async login(email: string, password: string): Promise<PublicUser> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.userService.findByEmailWithPassword(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password ?? '');
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.toPublicUser(user);
  }

  // ─── RBAC select auth ────────────────────────────────────────────────────────

  /**
   * Finds a user by email (no password check) and returns a signed JWT.
   * This satisfies the "Simple Auth" requirement where the caller selects
   * which user to act as.
   */
  async selectUser(email: string): Promise<string> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.userService.findByEmail(normalizedEmail);

    if (!user) {
      throw new NotFoundException(`No user found with email: ${normalizedEmail}`);
    }

    return this.getAccessToken(this.toPublicUser(user));
  }

  // ─── Token helpers ───────────────────────────────────────────────────────────

  getAccessToken(user: PublicUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      permissions: user.role?.permissions ?? []
    };
    return this.jwtService.sign(payload);
  }

  // ─── Me ──────────────────────────────────────────────────────────────────────

  /**
   * Returns the full user object (with role and permissions) for the
   * currently authenticated user. The caller already has the user from
   * request.user, but this re-fetches from DB to ensure freshness.
   */
  async me(userId: string): Promise<PublicUser> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    return this.toPublicUser(user);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
