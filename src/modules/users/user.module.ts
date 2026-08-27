import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { RoleEntity } from "../RBAC/entites/role.entity";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "../auth/guard/auth.guard";
import { RoleGuard } from "../RBAC/guard/role.guard";
import { PermissionEntity } from "../RBAC/entites/permission.entity";

@Module({
    imports : [TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity])],
    controllers: [UserController],
    providers: [UserService, JwtService, AuthGuard, RoleGuard],
    exports : [TypeOrmModule, UserService]
})
export class UserModule {}
