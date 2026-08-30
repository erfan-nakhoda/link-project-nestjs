import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkEntity } from "./entities/link.entity";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";
import { LinkUserEntity } from "./entities/link-user.entity";
import { GroupEntity } from "../groups/entities/group.entity";
import { UserEntity } from "../users/entities/user.entity";
import { AuthGuard } from "../../common/guard/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthService } from "../auth/jwt.service";

@Module({
    imports: [TypeOrmModule.forFeature([LinkEntity, LinkUserEntity, GroupEntity, UserEntity])],
    controllers: [LinksController],
    providers: [LinksService, JwtAuthService, AuthGuard],
    exports : [TypeOrmModule, LinksService]
})
export class LinksModule {}
