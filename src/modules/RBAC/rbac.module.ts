import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "./entites/role.entity";
import { RBACController } from "./rbac.controller";
import { RBACService } from "./rbac.service";
import { PermissionEntity } from "./entites/permission.entity";
import { RoleGuard } from "../../common/guard/role.guard";
import { AuthGuard } from "src/common/guard/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../users/entities/user.entity";
import { JwtAuthService } from "../auth/jwt.service";

@Module({
    imports : [TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity])],
    controllers : [RBACController],
    providers : [RBACService, JwtAuthService, AuthGuard, RoleGuard],
    exports : [TypeOrmModule, RBACService]
})

export class RBACModule {}
