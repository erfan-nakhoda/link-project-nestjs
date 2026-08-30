import { ConflictException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RoleEntity } from "../RBAC/entites/role.entity";
import { ChangePassDto, CreateUserDto, SetActivityDto, UpdateUserDto } from "./dto/user.dto";
import bcrypt from "bcrypt";
import { UserErrorMessage, UserSuccessMessage } from "./messages/user.message";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
        @Inject(REQUEST) private req: Request
    ) { }

    async getUsers() {
        return this.userRepo.find({ relations: { role: true } });
    }
    async whoAmI() {
        const {user} = this.req
        return user
    }
    async setUserActivity(id: number, dto: SetActivityDto) {
        const user = await this.findUser(id);
        user.isActive = dto.active;
        return this.userRepo.save(user);
    }
    async createUser(createUserDto: CreateUserDto) {
        const { username, password, roleId } = createUserDto
        const exists = await this.userRepo.findOneBy({ username });
        if (exists) throw new ConflictException(UserErrorMessage.usernameExist);
        const role = roleId ? await this.roleRepo.findOneBy({ id: +roleId }) : await this.roleRepo.findOneBy({ name: "USER" });
        const user = this.userRepo.create({ username, password: await bcrypt.hash(password, 10), roleId: role?.id });
        await this.userRepo.save(user);
        return {
            status : 200,
            message : UserSuccessMessage.userCreated
        }
    }
    async updateUser(updateUserDto: UpdateUserDto, id?: number) {
        const user = id ? await this.findUser(id) : this.req.user;
        if (!user) throw new UnauthorizedException(UserErrorMessage.userNotFound)
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const exists = await this.userRepo.findOneBy({ username: updateUserDto.username });
            if (exists) throw new ConflictException(UserErrorMessage.usernameExist);
            user.username = updateUserDto.username;
        }
        await this.userRepo.save(user);
        return {
            status : 200,
            message : UserSuccessMessage.userUpdated
        }
    }
    async deleteUser(id?: number) {
        const user = id ? await this.findUser(id) : this.req.user;
        if (!user) throw new UnauthorizedException(UserErrorMessage.userNotFound)
        await this.userRepo.remove(user);
        return { status: 200, message: UserSuccessMessage.deletedUser };
    }
    async changeUserPass(id: number, changePassDto: ChangePassDto) {
        const user = await this.findUser(id);
        user.password = await bcrypt.hash(changePassDto.password, 10);
        await this.userRepo.save(user);
        return { status: 200, message: UserSuccessMessage.passChanged };
    }
    private async findUser(id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException(UserErrorMessage.userNotFound);
        return user;
    }
}
