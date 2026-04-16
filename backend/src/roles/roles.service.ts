import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }
    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    if (dto.name !== undefined) {
      role.name = dto.name;
    }

    if (dto.permissions !== undefined) {
      role.permissions = dto.permissions;
    }

    return this.roleRepository.save(role);
  }
}
