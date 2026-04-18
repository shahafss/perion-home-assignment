import { Role } from '../../entities/Role';

/**
 * Shape returned from the GET /api/users endpoint.
 * `role` is omitted for callers that lack the `roles:view` permission.
 */
export class PublicUserDto {
  id!: string;
  name!: string;
  email!: string;
  role?: Role;
  createdAt!: Date;
  updatedAt!: Date;
}
