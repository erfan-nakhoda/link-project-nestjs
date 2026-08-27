import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "../auth/guard/auth.guard";
import { GroupEntity } from "../groups/entities/group.entity";
import { UserEntity } from "../users/entities/user.entity";
import { LinkEntity } from "./entities/link.entity";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";

@Module({
    imports: [TypeOrmModule.forFeature([LinkEntity, GroupEntity, UserEntity])],
    controllers: [LinksController],
    providers: [LinksService, AuthGuard, JwtService],
})
export class LinksModule {}
