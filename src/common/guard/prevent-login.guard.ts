import { BadRequestException, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthErrorMessage } from "src/modules/auth/messages/auth.message";

export class PreventLogin implements CanActivate {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>()
        const refreshToken = req.cookies['refresh-token']
        if(refreshToken) throw new BadRequestException(AuthErrorMessage.alreadyLoggedIn)
        return true
    }
}