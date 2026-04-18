import { Role } from '../../entities/Role';

/**
 * User shape returned from public-facing auth endpoints.
 * Excludes the password field; includes the full role with permissions.
 */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
