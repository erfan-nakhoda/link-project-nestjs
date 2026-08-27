import { SetMetadata } from "@nestjs/common"

export const PERMISSION_KEY = "PERMISSION_KEY"
export const Permissions = (...permissions : string[]) => SetMetadata(PERMISSION_KEY, permissions)

export const ROLE_KEY = "ROLE_KEY"
export const Role = (role : string) => SetMetadata(ROLE_KEY, role)