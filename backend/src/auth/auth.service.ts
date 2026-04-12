import {
  ConflictException,
  Injectable,
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
    const existingUser = await this.userService.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userService.createUser(normalizedEmail, passwordHash);
    return this.toPublicUser(user);
  }

  async login(email: string, password: string): Promise<PublicUser> {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.userService.findByEmailWithPassword(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.toPublicUser(user);
  }

  getAccessToken(user: PublicUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email
    };

    return this.jwtService.sign(payload);
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return this.toPublicUser(user);
  }

  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
