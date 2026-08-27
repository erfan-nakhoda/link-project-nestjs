import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "../auth/guard/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { GroupEntity } from "./entities/group.entity";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { UserEntity } from "../users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([GroupEntity, UserEntity])],
    controllers: [GroupsController],
    providers: [GroupsService, AuthGuard, JwtService],
})
export class GroupsModule {}
