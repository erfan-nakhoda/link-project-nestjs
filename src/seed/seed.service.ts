import { Injectable, OnModuleInit } from "@nestjs/common";
import { PermissionSeed } from "./permission.seed";
import { RoleSeed } from "./role.seed";
import { UserSeed } from "./user.seed";

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        private readonly roleSeed: RoleSeed,
        private readonly permissionSeed: PermissionSeed,
        private readonly userSeed: UserSeed,
    ) {}
    async onModuleInit() {
        await this.roleSeed.run();
        await this.permissionSeed.run();
        await this.userSeed.run();
    }
}
