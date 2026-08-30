import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "../../modules/RBAC/entites/role.entity";
import { Repository } from "typeorm";
import { PermissionEntity } from "../../modules/RBAC/entites/permission.entity";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY, ROLE_KEY } from "src/common/decorator/role.decorator";
import { AuthErrorMessage } from "src/modules/auth/messages/auth.message";

export class RoleGuard implements CanActivate {
    constructor(@InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity) private permissionRepo: Repository<PermissionEntity>,
        private reflector: Reflector
    ) { }
    canActivate(context: ExecutionContext) {
        const { user } = context.switchToHttp().getRequest<Request>()
        const permissions = user?.role?.permissions?.map(permission => permission.name) ?? []
        const role = user?.role?.name
        const requiredRole = this.reflector.getAllAndOverride<string>(ROLE_KEY, [context.getHandler(), context.getClass()])
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [context.getHandler(), context.getClass()])
        if ((!requiredPermissions || requiredPermissions.length === 0) && !requiredRole) return true
        if (requiredRole) {
            if (role !== requiredRole) throw new ForbiddenException(AuthErrorMessage.forbidden)
            return true
        }
        if (!requiredPermissions.every(permission => permissions.includes(permission))) throw new ForbiddenException(AuthErrorMessage.forbidden)
        return true
    }

}
