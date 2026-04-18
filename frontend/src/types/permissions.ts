/**
 * Single source of truth for role names.
 * Mirrors ROLE_SEEDS in backend/src/database/seeder.service.ts.
 * Use ROLE.Admin etc. at call sites — never raw strings.
 */
export const ROLE = {
  Admin:  "Admin",
  Editor: "Editor",
  Viewer: "Viewer",
} as const;

export type RoleName = typeof ROLE[keyof typeof ROLE];

export const PERMISSIONS = {
  UsersView:   "users:view",
  UsersCreate: "users:create",
  UsersEdit:   "users:edit",
  UsersDelete: "users:delete",
  RolesView:   "roles:view",
  RolesEdit:   "roles:edit",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
