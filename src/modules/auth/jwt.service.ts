import { JwtService } from "@nestjs/jwt";
import { IAccessTokenPayload, IPayload, IVerifyAccessTokenPayload } from "./interfaces/jwt.interface";
import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common";
import { AuthErrorMessage } from "./messages/auth.message";

@Injectable()
export class JwtAuthService {
    constructor(private readonly tokenService : JwtService) {}
    async signAccessToken (accessTkPayload : IAccessTokenPayload) : Promise<string> {
        const {payload, secret} = accessTkPayload
        const token = await this.tokenService.signAsync(payload, {secret,
            expiresIn : 60 * 5
        }) 
        if (!token) throw new BadGatewayException(AuthErrorMessage.somthingWentWrong)
        return token
    }
    async verifyAccessToken (verifyAccessTkPayload : IVerifyAccessTokenPayload) : Promise<IPayload> {
        const {secret, token} = verifyAccessTkPayload
        const payload = await this.tokenService.verifyAsync(token, {secret})
        if(!payload) throw new BadRequestException(AuthErrorMessage.tokenInvalid)
        return payload
    }
    async signRefreshToken (refreshTkPayload : IAccessTokenPayload) : Promise<string> {
        const {payload, secret} = refreshTkPayload 
        const token = await this.tokenService.signAsync(payload, {secret, expiresIn : 60 * 15}) 
        if (!token) throw new BadGatewayException(AuthErrorMessage.somthingWentWrong)
        return token
    }
    async verifyRefreshToken (verifyRefreshTkPayload : IVerifyAccessTokenPayload) : Promise<IPayload> {
        const {secret, token} = verifyRefreshTkPayload
        const payload = await this.tokenService.verifyAsync(token, {secret})
        if(!payload) throw new BadRequestException(AuthErrorMessage.tokenInvalid)
        return payload
    }
}