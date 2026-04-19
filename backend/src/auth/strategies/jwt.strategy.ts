import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../entities/User';
import { UserService } from '../../users/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

interface JwtRequestLike {
  cookies?: Record<string, unknown>;
  headers?: Record<string, string | string[] | undefined>;
}

/**
 * Extracts the JWT from either the `access_token` cookie
 * or the `Authorization: Bearer <token>` header.
 */
const cookieOrBearerExtractor = (req: JwtRequestLike): string | null => {
  const cookieToken = req?.cookies?.access_token;
  if (typeof cookieToken === 'string' && cookieToken.length > 0) {
    return cookieToken;
  }

  const authHeader = req?.headers?.authorization;
  const rawValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!rawValue || !rawValue.startsWith('Bearer ')) {
    return null;
  }

  const bearerToken = rawValue.slice('Bearer '.length).trim();
  return bearerToken.length > 0 ? bearerToken : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieOrBearerExtractor]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret
    });
  }

  /**
   * Called by Passport after the token signature is verified.
   * Returns the full User entity (including eagerly-loaded role) which Passport
   * assigns to `request.user`. A DB lookup here ensures revoked/deleted users
   * are rejected immediately rather than relying on token expiry.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Token references a non-existent user');
    }
    return user;
  }
}
