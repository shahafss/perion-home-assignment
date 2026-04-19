import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const DEFAULT_ROLE_NAME = 'Viewer';

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

  /**
   * Creates a user with a mandatory role. 
   * Defaults to 'Viewer' if no roleId is provided (e.g., during signup).
   */
  async create(dto: CreateUserDto, password?: string): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException(`Email "${dto.email}" is already in use`);
    }

    const role = await this.getRoleByIdOrName(dto.roleId, DEFAULT_ROLE_NAME);

    const user = this.userRepository.create({
      ...dto,
      password: password ?? null,
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
      user.role = await this.getRoleByIdOrName(dto.roleId);
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

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Resolves a Role with strict error handling: 
   * 404 for invalid IDs, 500 for missing system-critical roles (seeding issues).
   */
  private async getRoleByIdOrName(id?: string, name?: string): Promise<Role> {
    if (id) {
      const role = await this.roleRepository.findOne({ where: { id } });
      if (!role) throw new NotFoundException(`Role with id "${id}" not found`);
      return role;
    }

    if (name) {
      const role = await this.roleRepository.findOne({ where: { name } });
      if (!role) {
        throw new InternalServerErrorException(`System role "${name}" is missing. Check seeder.`);
      }
      return role;
    }

    throw new InternalServerErrorException('Role resolution requires ID or Name.');
  }
}
