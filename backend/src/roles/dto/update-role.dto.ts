import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  /**
   * Full replacement of the permissions array.
   * Each entry should be a permission string in the form "resource:action"
   * (e.g. "users:view", "roles:edit").
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
