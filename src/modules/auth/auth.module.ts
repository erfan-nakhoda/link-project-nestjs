import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { RBACModule } from '../RBAC/rbac.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';

@Module({
  imports : [UserModule, RBACModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService],
  exports : [AuthService, JwtAuthService]
})
export class AuthModule {}
