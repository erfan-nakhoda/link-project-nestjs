import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "./entites/role.entity";
import { Repository } from "typeorm";
import { PermissionEntity } from "./entites/permission.entity";
import { CreatePermissionDto, CreateRoleDto } from "./dto/create-rbac.dto";
import { UpdatePermissionDto, UpdateRoleDto } from "./dto/update-rbac.dto";

@Injectable()
export class RBACService {
    constructor(@InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity) private permissionEntity: Repository<PermissionEntity>,
        ) { }

    async createPermission(dto: CreatePermissionDto) {
        const role = await this.roleRepo.findOneBy({ id: Number(dto.roleId) });
        if (!role) throw new NotFoundException("Role not found");
        const exists = await this.permissionEntity.findOneBy({ name: dto.name });
        if (exists) throw new ConflictException("Permission already exists");
        return this.permissionEntity.save(this.permissionEntity.create({ name: dto.name, roleId: Number(dto.roleId) }));
    }
    async updatePermission(id: number, dto: UpdatePermissionDto) {
        const permission = await this.permissionEntity.findOneBy({ id });
        if (!permission) throw new NotFoundException("Permission not found");
        if (dto.roleId !== undefined) {
            const role = await this.roleRepo.findOneBy({ id: Number(dto.roleId) });
            if (!role) throw new NotFoundException("Role not found");
            permission.roleId = Number(dto.roleId);
        }
        if (dto.name) permission.name = dto.name;
        return this.permissionEntity.save(permission);
    }
    async deletePermission(id: number) {
        const permission = await this.permissionEntity.findOneBy({ id });
        if (!permission) throw new NotFoundException("Permission not found");
        await this.permissionEntity.remove(permission);
        return { status: 200, message: "Permission deleted successfully" };
    }
    async getAll() {
        return { roles: await this.roleRepo.find({ relations: { permissions: true } }), permissions: await this.permissionEntity.find() };
    }

    async createRole(dto: CreateRoleDto) {
        const exists = await this.roleRepo.findOneBy({ name: String(dto.name) });
        if (exists) throw new ConflictException("Role already exists");
        return this.roleRepo.save(this.roleRepo.create({ name: String(dto.name), title: dto.title }));
    }
    async updateRole(id: number, dto: UpdateRoleDto) {
        const role = await this.roleRepo.findOneBy({ id });
        if (!role) throw new NotFoundException("Role not found");
        Object.assign(role, dto);
        if (dto.name !== undefined) role.name = String(dto.name);
        return this.roleRepo.save(role);
    }
    async deleteRole(id: number) {
        const role = await this.roleRepo.findOneBy({ id });
        if (!role) throw new NotFoundException("Role not found");
        await this.roleRepo.remove(role);
        return { status: 200, message: "Role deleted successfully" };
    }

}
