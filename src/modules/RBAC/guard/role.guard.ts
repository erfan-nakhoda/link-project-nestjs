import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "../entites/role.entity";
import { Repository } from "typeorm";
import { PermissionEntity } from "../entites/permission.entity";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY, ROLE_KEY } from "src/common/decorator/role.decorator";

@Injectable()
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
        if (requiredRole) return role === requiredRole
        return requiredPermissions.every(permission => permissions.includes(permission))
    }

}
