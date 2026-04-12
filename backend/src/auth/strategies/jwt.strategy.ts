import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../users/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

interface JwtRequestLike {
  cookies?: Record<string, unknown>;
  headers?: Record<string, string | string[] | undefined>;
}

const cookieExtractor = (req: JwtRequestLike): string | null => {
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
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const existingUser = await this.userService.findById(payload.sub);
    if (!existingUser) {
      throw new UnauthorizedException('Invalid token user');
    }

    return {
      sub: payload.sub,
      email: payload.email
    };
  }
}
