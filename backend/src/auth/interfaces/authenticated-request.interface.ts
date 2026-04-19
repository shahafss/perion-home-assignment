import { Request } from 'express';
import { User } from '../../entities/User';

/**
 * Express Request augmented with the full User entity after JWT validation.
 * `request.user` is set by JwtStrategy.validate() and always includes the
 * eagerly-loaded role (with permissions).
 */
export interface AuthenticatedRequest extends Request {
  user: User;
}
