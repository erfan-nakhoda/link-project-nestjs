import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "../modules/RBAC/entites/role.entity";

@Injectable()
export class RoleSeed {
    constructor(@InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>) {}
    async run() {
        for (const role of [{ name: "ADMIN", title: "مدیر" }, { name: "USER", title: "کاربر" }]) {
            if (!(await this.roleRepo.findOneBy({ name: role.name }))) await this.roleRepo.save(this.roleRepo.create(role));
        }
    }
}
