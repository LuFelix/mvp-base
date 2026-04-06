import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

   canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; 
    }

    const { user } = context.switchToHttp().getRequest();

    // Verifique se o user existe e se a role está lá (em minúsculo)
    const userRole = user?.role?.toLowerCase().trim();

    if (!userRole) {
      throw new ForbiddenException('Acesso negado: Perfil sem permissões.');
    }

    // Compara ignorando maiúsculas/minúsculas
    const hasRole = requiredRoles.some(role => role.toLowerCase().trim() === userRole);

    if (!hasRole) {
      throw new ForbiddenException(`Acesso negado: Você tem a role '${userRole}', mas é necessária uma destas: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}