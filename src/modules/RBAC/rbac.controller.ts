import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { RBACService } from "./rbac.service";
import { CreatePermissionDto, CreateRoleDto } from "./dto/create-rbac.dto";
import { UpdatePermissionDto, UpdateRoleDto } from "./dto/update-rbac.dto";
import { AuthGuard } from "../../common/guard/auth.guard";
import { Permissions } from "src/common/decorator/role.decorator";
import { RoleGuard } from "../../common/guard/role.guard";

@Controller('/rbac')
@UseGuards(AuthGuard, RoleGuard)
@Permissions("RBAC:WRITE")
export class RBACController {
    constructor(private rbacService: RBACService) { }
    @Post('/create-permission')
    createPermission(@Body() createPermissionDto: CreatePermissionDto) {
        return this.rbacService.createPermission(createPermissionDto)
    }
    @Patch('/update-permission/:id')
    updatePermission(@Param("id", new ParseIntPipe()) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.rbacService.updatePermission(id, updatePermissionDto)
    }
    @Delete('/delete-permission/:id')
    deletePermission(@Param("id", new ParseIntPipe()) id: number) {
        return this.rbacService.deletePermission(id)
    }
    @Get('/get-all')
    getAll() {
        return this.rbacService.getAll()
    }
    @Post('/create-role')
    createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rbacService.createRole(createRoleDto)
    }
    @Patch('/update-role/:id')
    updateRole(@Param("id", new ParseIntPipe()) id: number, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rbacService.updateRole(id, updateRoleDto)
    }
    @Delete('/delete-role/:id')
    deleteRole(@Param("id", new ParseIntPipe()) id: number) {
        return this.rbacService.deleteRole(id)
    }
}
