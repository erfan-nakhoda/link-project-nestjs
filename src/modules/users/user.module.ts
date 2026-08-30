import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { AuthGuard } from "src/common/guard/auth.guard";
import { RoleGuard } from "src/common/guard/role.guard";
import { JwtService } from "@nestjs/jwt";
import { RoleEntity } from "../RBAC/entites/role.entity";
import { PermissionEntity } from "../RBAC/entites/permission.entity";
import { JwtAuthService } from "../auth/jwt.service";

@Module({
    imports : [TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity])],
    controllers: [UserController],
    providers: [UserService, JwtAuthService, AuthGuard, RoleGuard],
    exports : [TypeOrmModule, UserService]
})
export class UserModule {}
