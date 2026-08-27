import { PartialType } from "@nestjs/swagger";
import { CreatePermissionDto, CreateRoleDto } from "./create-rbac.dto";

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}