import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { User } from '../entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * GET /api/users
   * Accessible by any authenticated user (no specific permission required).
   */
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * POST /api/users
   * Restricted to users with the "users:create" permission (Admin only).
   */
  @Post()
  @Permissions('users:create')
  async create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }

  /**
   * PUT /api/users/:id
   * Restricted to users with the "users:edit" permission (Admin, Editor).
   */
  @Put(':id')
  @Permissions('users:edit')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(id, body);
  }

  /**
   * DELETE /api/users/:id
   * Restricted to users with the "users:delete" permission (Admin only).
   */
  @Delete(':id')
  @Permissions('users:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
