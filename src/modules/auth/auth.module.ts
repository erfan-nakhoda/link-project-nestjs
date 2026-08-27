import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { RBACModule } from '../RBAC/rbac.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports : [UserModule, RBACModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
