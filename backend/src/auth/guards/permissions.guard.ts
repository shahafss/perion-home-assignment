import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../../entities/User';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * Guards a route by verifying the authenticated user's role contains
 * ALL permissions declared via @Permissions(...).
 *
 * Must be composed after JwtAuthGuard so that request.user is already
 * populated by the JWT strategy before this guard runs.
 *
 * If no @Permissions decorator is present on the handler, the guard
 * passes through automatically (behaves as a no-op).
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // No @Permissions decorator — allow any authenticated user through.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined;

    const userPermissions = user?.role?.permissions ?? [];

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`
      );
    }

    return true;
  }
}
