import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionEntity } from "../modules/RBAC/entites/permission.entity";
import { RoleEntity } from "../modules/RBAC/entites/role.entity";
import { UserEntity } from "../modules/users/entities/user.entity";
import { PermissionSeed } from "./permission.seed";
import { RoleSeed } from "./role.seed";
import { SeedService } from "./seed.service";
import { UserSeed } from "./user.seed";

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity, UserEntity])],
    providers: [SeedService, RoleSeed, PermissionSeed, UserSeed],
})
export class SeedModule {}
