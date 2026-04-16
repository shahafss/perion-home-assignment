import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards
} from '@nestjs/common';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Role } from '../entities/Role';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * GET /api/roles
   * Accessible to Admin and Editor (anyone with "roles:view" permission).
   */
  @Get()
  @Permissions('roles:view')
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  /**
   * PUT /api/roles/:id
   * Restricted to Admin only (requires "roles:edit" permission).
   */
  @Put(':id')
  @Permissions('roles:edit')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateRoleDto
  ): Promise<Role> {
    return this.rolesService.update(id, body);
  }
}
