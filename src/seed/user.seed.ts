import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { RoleEntity } from "../modules/RBAC/entites/role.entity";
import { UserEntity } from "../modules/users/entities/user.entity";

@Injectable()
export class UserSeed {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private readonly roleRepo: Repository<RoleEntity>,
    ) {}
    async run() {
        const password = process.env.SEED_ADMIN_PASSWORD;
        if (!password || await this.userRepo.findOneBy({ username: "admin" })) return;
        const adminRole = await this.roleRepo.findOneBy({ name: "ADMIN" });
        if (!adminRole) return;
        await this.userRepo.save(this.userRepo.create({
            username: "admin",
            password: await bcrypt.hash(password, 10),
            roleId: adminRole.id,
        }));
    }
}
