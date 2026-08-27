import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Repository } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const accessToken = this.getAccessToken(request);
        const refreshToken = this.getRefreshToken(request);
        let payload: Record<string, unknown> | undefined;

        if (accessToken) {
            payload = await this.verify(accessToken);
        }
        if (!payload && refreshToken) {
            payload = await this.verify(refreshToken);
        }
        if (!payload) throw new UnauthorizedException("Invalid or missing token");

        const userId = payload.sub ?? payload.id ?? payload.userId;
        const user = await this.userRepo.findOne({
            where: { id: Number(userId) },
            relations: { role: { permissions: true } },
        });
        if (!user || !user.isActive) throw new UnauthorizedException("User is inactive or does not exist");

        request.user = user;
        return true;
    }

    private async verify(token: string): Promise<Record<string, unknown> | undefined> {
        try {
            return await this.jwtService.verifyAsync<Record<string, unknown>>(token, {
                secret: process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET,
            });
        } catch {
            return undefined;
        }
    }

    private getAccessToken(request: Request): string | undefined {
        const header = request.headers.authorization;
        return header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    }

    private getRefreshToken(request: Request): string | undefined {
        const cookies = (request as Request & { cookies?: Record<string, string> }).cookies;
        if (cookies?.refreshToken ?? cookies?.refresh_token) return cookies.refreshToken ?? cookies.refresh_token;
        const rawCookie = request.headers.cookie;
        const match = rawCookie?.match(/(?:^|;\s*)(?:refreshToken|refresh_token)=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : undefined;
    }
}
