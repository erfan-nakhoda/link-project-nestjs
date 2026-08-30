import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpAuthDto, loginAuthDto } from './dto/create-auth.dto';
import { GetRequestInterceptor } from 'src/common/interceptors/request.interceptor';
import { ApiConsumes } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enum/swagger.enum';
import type { Request, Response } from 'express';
import { PreventLogin } from 'src/common/guard/prevent-login.guard';

@Controller('/auth')
@ApiConsumes(SwaggerConsumes.json, SwaggerConsumes.urlencoded)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  signUp(@Body() signUpAuthDto: signUpAuthDto) {
    return this.authService.signUp(signUpAuthDto);
  }
  @Post("/login")
  @UseGuards(PreventLogin)
  async logIn(@Body() loginAuthDto: loginAuthDto, @Res() res: Response) {
    const { refreshToken, ...other } = await this.authService.logIn(loginAuthDto);
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: false,
      maxAge: 15 * 1000 * 60
    })
    return res.status(other.status).json(other)
  }
  @Get('/logout')
  logOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logOut(req, res)
  }

  @Get('/refresh')
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const { refreshToken, ...rest } = await this.authService.refreshTokens(req)
    res.clearCookie("refresh-token", {
      httpOnly: true,
      sameSite: false,
      secure: false,
    })
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: false,
      secure: false,
      maxAge: 60 * 1000 * 15
    })
    res.status(rest.status).json(rest)
  }
  @Get("/clear-cookie")
  clearCookie(@Res() res: Response) {
    res.clearCookie("refresh-token", {
      httpOnly: true,
      sameSite: false,
      secure: false,
    })
    res.status(200).json({
      status : 200,
      message : "deleted"
    })
  }

}
