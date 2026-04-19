import { SetMetadata } from '@nestjs/common';

/** Metadata key used by PermissionsGuard to read required permissions. */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Attach required permission strings to a route handler or controller.
 * The PermissionsGuard will enforce that the authenticated user's role
 * contains ALL of the listed permissions.
 *
 * @example
 * @Permissions('users:create', 'users:edit')
 * @Post()
 * create() { ... }
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
