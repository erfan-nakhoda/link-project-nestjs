import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpAuthDto, loginAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signUp(@Body() signUpAuthDto: signUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }
  @Post()
  logIn(@Body() loginAuthDto: loginAuthDto) {
    // return this.authService.create(loginAuthDto);
  }
  @Post()
  logOut() {
    // return this.authService.create();
  }
}
