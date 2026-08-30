import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export class GetRequestInterceptor implements NestInterceptor<any, any> {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const req = context.switchToHttp().getRequest<Request>()
        console.log(`user ${req.clientIp} request to ${req.url} with method ${req.method}`)
        return next.handle()
    }

}