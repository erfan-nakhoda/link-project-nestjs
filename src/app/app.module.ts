import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/configs/typeorm.config';
import { RBACModule } from 'src/modules/RBAC/rbac.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/users/user.module';
import { LinksModule } from 'src/modules/links/links.module';
import { GroupsModule } from 'src/modules/groups/groups.module';
import { SeedModule } from 'src/seed/seed.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }), TypeOrmModule.forRoot(TypeOrmConfig()),JwtModule.register({
    global : true,
    secret : process.env.JWT_SECRET
  }), RBACModule, AuthModule, UserModule, LinksModule, GroupsModule, SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
