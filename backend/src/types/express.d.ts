import { User } from '../entities/User';

declare global {
  namespace Express {
    // Overrides the Passport default so request.user is the full User entity
    // (with eagerly-loaded role) set by JwtStrategy.validate().
    interface Request {
      user?: User;
    }
  }
}

export {};
