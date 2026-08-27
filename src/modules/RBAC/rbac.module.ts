import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./entites/role.entity";
import { RBACController } from "./rbac.controller";
import { RBACService } from "./rbac.service";
import { PermissionEntity } from "./entites/permission.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../auth/guard/auth.guard";
import { RoleGuard } from "./guard/role.guard";
import { UserEntity } from "../users/entities/user.entity";

@Module({
    imports : [TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity])],
    controllers : [RBACController],
    providers : [RBACService, JwtService, AuthGuard, RoleGuard],
    exports : [TypeOrmModule]
})

export class RBACModule {}
