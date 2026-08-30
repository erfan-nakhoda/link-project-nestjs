import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { JwtAuthService } from "src/modules/auth/jwt.service";
import { AuthErrorMessage } from "src/modules/auth/messages/auth.message";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtAuthService,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const accessToken = this.getAccessToken(request);
        const { userId, roleId } = await this.jwtService.verifyAccessToken({ secret: process.env.ACCESS_TOKEN_SECRET, token: accessToken })
        const user = await this.userRepo.findOne({where : {id: userId, roleId}, relations : {role : {permissions : true}}, select : {role : {title : true, permissions : {name : true}}} })
        if (!user) throw new UnauthorizedException(AuthErrorMessage.loginAgain)
        request.user = user;
        return true;
    }

    private getAccessToken(request: Request): string {
        const authorization = request.headers.authorization;
        if (!authorization) throw new UnauthorizedException(AuthErrorMessage.loginAgain)
        const [bearer, accessToken] = authorization?.split(' ')
        if (!bearer || bearer.toLowerCase() !== "bearer" || !accessToken) throw new UnauthorizedException(AuthErrorMessage.loginAgain)
        return accessToken
    }
}
