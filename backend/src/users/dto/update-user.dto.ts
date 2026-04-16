import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  /** Reassign the user to a different role by its UUID. */
  @IsOptional()
  @IsUUID('4', { message: 'roleId must be a valid UUID' })
  roleId?: string;
}
