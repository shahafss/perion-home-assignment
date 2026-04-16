import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  // ─── Read ────────────────────────────────────────────────────────────────────

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /** Returns the user with its eagerly-loaded role (including permissions). */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }

  // ─── Write ───────────────────────────────────────────────────────────────────

  /** Creates a user via the admin users:create endpoint. */
  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email }
    });
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" is already in use`);
    }

    let role: Role | null = null;
    if (dto.roleId) {
      role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
      if (!role) {
        throw new NotFoundException(`Role with id "${dto.roleId}" not found`);
      }
    }

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: null,
      role
    });

    return this.userRepository.save(user);
  }

  /** Updates mutable fields of an existing user. */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    if (dto.email && dto.email !== user.email) {
      const emailTaken = await this.userRepository.findOne({
        where: { email: dto.email }
      });
      if (emailTaken) {
        throw new ConflictException(`Email "${dto.email}" is already in use`);
      }
      user.email = dto.email;
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    if (dto.roleId !== undefined) {
      const role = await this.roleRepository.findOne({
        where: { id: dto.roleId }
      });
      if (!role) {
        throw new NotFoundException(`Role with id "${dto.roleId}" not found`);
      }
      user.role = role;
    }

    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    await this.userRepository.remove(user);
  }

  // ─── Internal seeder helper ──────────────────────────────────────────────────

  /** Used only by AuthService legacy signup flow. */
  async createUser(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      name: email,
      email,
      password,
      role: null
    });
    return this.userRepository.save(user);
  }
}
