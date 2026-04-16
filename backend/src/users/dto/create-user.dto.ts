import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;

  /** Assign an existing role by its UUID. Optional — user can be created without a role. */
  @IsOptional()
  @IsUUID('4', { message: 'roleId must be a valid UUID' })
  roleId?: string;
}
