import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntity } from "../modules/RBAC/entites/permission.entity";
import { RoleEntity } from "../modules/RBAC/entites/role.entity";

@Injectable()
export class PermissionSeed {
    constructor(
        @InjectRepository(PermissionEntity) private readonly permissionRepo: Repository<PermissionEntity>,
        @InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>,
    ) {}
    async run() {
        const admin = await this.roleRepo.findOneBy({ name: "ADMIN" });
        if (!admin) return;
        for (const name of ["USER:READ", "USER:WRITE", "RBAC:READ", "RBAC:WRITE", 'USER.ACTIVITY']) {
            if (!(await this.permissionRepo.findOneBy({ name }))) {
                await this.permissionRepo.save(this.permissionRepo.create({ name, roleId: admin.id }));
            }
        }
    }
}
