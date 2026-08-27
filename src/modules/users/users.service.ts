import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RoleEntity } from "../RBAC/entites/role.entity";
import { ChangePassDto, SetActivityDto, UpdateUserDto } from "./dto/user.dto";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepo : Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepo : Repository<RoleEntity>,) {}

    async getUsers() {
        return this.userRepo.find({ relations: { role: true } });
    }
    async setUserActivity(id: number, dto: SetActivityDto) {
        const user = await this.findUser(id);
        user.isActive = dto.active;
        return this.userRepo.save(user);
    }
    async createUser(username: string, password: string, roleId?: number) {
        const exists = await this.userRepo.findOneBy({ username });
        if (exists) throw new ConflictException("Username already exists");
        const role = roleId ? await this.roleRepo.findOneBy({ id: roleId }) : await this.roleRepo.findOneBy({ name: "USER" });
        const user = this.userRepo.create({ username, password: await bcrypt.hash(password, 10), roleId: role?.id });
        return this.userRepo.save(user);
    }
    async updateUser(id: number, dto: UpdateUserDto) {
        const user = await this.findUser(id);
        if (dto.username && dto.username !== user.username) {
            const exists = await this.userRepo.findOneBy({ username: dto.username });
            if (exists) throw new ConflictException("Username already exists");
            user.username = dto.username;
        }
        return this.userRepo.save(user);
    }
    async deleteUser(id: number) {
        const user = await this.findUser(id);
        await this.userRepo.remove(user);
        return { status: 200, message: "User deleted successfully" };
    }
    async changeUserPass(id: number, dto: ChangePassDto) {
        const user = await this.findUser(id);
        user.password = await bcrypt.hash(dto.password, 10);
        await this.userRepo.save(user);
        return { status: 200, message: "Password changed successfully" };
    }
    private async findUser(id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException("User not found");
        return user;
    }
}
