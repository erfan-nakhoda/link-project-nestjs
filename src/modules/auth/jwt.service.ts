import { JwtService } from "@nestjs/jwt";

export class JwtAuthService {
    constructor(private tokenService : JwtService) {}
    signAccessToken () {}
    verifyAccessToken () {}
}