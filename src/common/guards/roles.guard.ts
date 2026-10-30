import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user || !user.role)
      throw new ForbiddenException(`Access denied, Insufficient permissions.`);

    const hasRoles = requiredRoles.includes(user.role);

    if (!hasRoles)
      throw new ForbiddenException(
        `Access denied, required roles [${requiredRoles.join(',')}]`,
      );
    return true;
  }
}
