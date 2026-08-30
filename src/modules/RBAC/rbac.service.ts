import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./entites/role.entity";
import { Repository } from "typeorm";
import { PermissionEntity } from "./entites/permission.entity";
import { CreatePermissionDto, CreateRoleDto } from "./dto/create-rbac.dto";
import { UpdatePermissionDto, UpdateRoleDto } from "./dto/update-rbac.dto";
import { RBACErrorMessage, RBACSuccessMessage } from "./messages/rbac.message";

@Injectable()
export class RBACService {
    constructor(@InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity) private permissionEntity: Repository<PermissionEntity>,
        ) { }

    async createPermission(dto: CreatePermissionDto) {
        const role = await this.roleRepo.findOneBy({ id: Number(dto.roleId) });
        if (!role) throw new NotFoundException(RBACErrorMessage.roleNotExist);
        const exists = await this.permissionEntity.findOneBy({ name: dto.name });
        if (exists) throw new ConflictException(RBACErrorMessage.permissionExist);
        const permission = this.permissionEntity.create({ name: dto.name, roleId: Number(dto.roleId) })
        await this.permissionEntity.save(permission);
        return {
            status : 201,
            message : RBACSuccessMessage.permissionCreated
        }
    }
    async updatePermission(id: number, dto: UpdatePermissionDto) {
        const permission = await this.permissionEntity.findOneBy({ id });
        if (!permission) throw new NotFoundException(RBACErrorMessage.permissionNotExist);
        if (dto.roleId !== undefined) {
            const role = await this.roleRepo.findOneBy({ id: Number(dto.roleId) });
            if (!role) throw new NotFoundException(RBACErrorMessage.roleNotExist);
            permission.roleId = Number(dto.roleId);
        }
        if (dto.name) permission.name = dto.name;
        await this.permissionEntity.save(permission);
        return {
            status : 200,
            message : RBACSuccessMessage.permissionUpdated
        }
    }
    async deletePermission(id: number) {
        const permission = await this.permissionEntity.findOneBy({ id });
        if (!permission) throw new NotFoundException(RBACErrorMessage.permissionNotExist);
        await this.permissionEntity.remove(permission);
        return { status: 200, message: RBACSuccessMessage.permissionDeleted };
    }
    async getAll() {
        return { status : 200, roles: await this.roleRepo.find({ relations: { permissions: true }, select : {permissions : {name : true}} })};
    }

    async createRole(dto: CreateRoleDto) {
        const exists = await this.roleRepo.findOneBy({ name: String(dto.name) });
        if (exists) throw new ConflictException(RBACErrorMessage.roleExist);
        await this.roleRepo.save(this.roleRepo.create({ name: String(dto.name), title: dto.title }));
        return {
            status : 201,
            message : RBACSuccessMessage.roleCreated
        }
    }
    async updateRole(id: number, dto: UpdateRoleDto) {
        const role = await this.roleRepo.findOneBy({ id });
        if (!role) throw new NotFoundException(RBACErrorMessage.roleNotExist);
        Object.assign(role, dto);
        if (dto.name !== undefined) role.name = String(dto.name);
        await this.roleRepo.save(role);
        return {
            status : 200,
            message : RBACSuccessMessage.roleUpdated
        }
    }
    async deleteRole(id: number) {
        const role = await this.roleRepo.findOneBy({ id });
        if (!role) throw new NotFoundException(RBACErrorMessage.roleNotExist);
        await this.roleRepo.remove(role);
        return { status: 200, message: RBACSuccessMessage.roleDeleted };
    }

}
