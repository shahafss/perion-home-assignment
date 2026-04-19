import { type Permission, type RoleName } from './permissions';

/**
 * Canonical Role shape shared across all API modules and composables.
 * Strictly typed against the Permission and RoleName unions.
 */
export interface Role {
  id: string;
  name: RoleName;
  permissions: Permission[];
}

/**
 * Canonical User shape shared across all API modules and composables.
 * `role` is optional — the API omits it for callers without `roles:view`.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: Role;
}
