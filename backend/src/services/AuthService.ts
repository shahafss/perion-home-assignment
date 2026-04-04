import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export interface PublicUser {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export class AuthServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AuthServiceError';
    this.statusCode = statusCode;
  }
}

const SALT_ROUNDS = 12;

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async signup(email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      throw new AuthServiceError('Email is already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = this.userRepository.create({
      email: normalizedEmail,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(user);
    const token = this.signToken(savedUser);

    return {
      user: this.toPublicUser(savedUser),
      token
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: normalizedEmail })
      .getOne();

    if (!user) {
      throw new AuthServiceError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthServiceError('Invalid email or password', 401);
    }

    const token = this.signToken(user);

    return {
      user: this.toPublicUser(user),
      token
    };
  }

  private signToken(user: Pick<User, 'id' | 'email'>): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AuthServiceError('JWT configuration is missing', 500);
    }

    return jwt.sign({ sub: user.id, email: user.email }, secret, {
      expiresIn: '7d'
    });
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
