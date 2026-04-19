/**
 * Shape of the data signed into every JWT.
 * `permissions` is embedded at sign time so the PermissionsGuard can
 * validate access without an extra DB round-trip (though the strategy
 * still does a DB lookup to ensure the user still exists).
 */
export interface JwtPayload {
  /** User UUID. */
  sub: string;
  email: string;
  /** Flat array of permission strings copied from the user's role at login. */
  permissions: string[];
}
