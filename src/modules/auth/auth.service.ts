import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { loginAuthDto, signUpAuthDto } from './dto/create-auth.dto';
import { AuthErrorMessage, AuthSuccessMessage } from './messages/auth.message';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from "bcrypt"
import { RoleEntity } from '../RBAC/entites/role.entity';
import { JwtAuthService } from './jwt.service';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    private readonly jwtService: JwtAuthService
  ) { }

  async signUp(signUpDto: signUpAuthDto) {
    const { username, password, confirm_password } = signUpDto
    const regexp = /[^a-z._]/gmi
    if (username.match(regexp)) throw new BadRequestException(AuthErrorMessage.usernameInvalid)
    if (password !== confirm_password) throw new BadRequestException(AuthErrorMessage.confirmPasswordInvalid)
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, salt)
    const role = await this.roleRepo.findOneBy({ name: "USER" })
    await this.userRepo.insert({
      username,
      password: hashedPass,
      roleId: role?.id
    })

    return {
      status: 201,
      message: AuthSuccessMessage.signup
    }
  }

  async logIn(loginDto: loginAuthDto) {
    const { username, password } = loginDto
    const user = await this.userRepo.findOneBy({ username })
    if (!user) throw new NotFoundException(AuthErrorMessage.signUpDataInvalid)
    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(AuthErrorMessage.signUpDataInvalid)
    console.log({ secret: process.env.ACCESS_TOKEN_SECRET, payload: { userId: user?.id, roleId: user?.roleId } })
    const accessToken = await this.jwtService.signAccessToken({ secret: process.env.ACCESS_TOKEN_SECRET, payload: { userId: user?.id, roleId: user?.roleId } })
    const refreshToken = await this.jwtService.signRefreshToken({ secret: process.env.REFRESH_TOKEN_SECRET, payload: { userId: user?.id, roleId: user?.roleId } })
    user.hashedRt = await bcrypt.hash(refreshToken, 10)
    await this.userRepo.save(user)
    return {
      status: 200,
      message: AuthSuccessMessage.login,
      accessToken,
      refreshToken  : refreshToken
    }
  }

  async refreshTokens(req: Request) {
    let refreshToken = req.cookies['refresh-token']
    if (!refreshToken) throw new UnauthorizedException(AuthErrorMessage.loginAgain)
    const user = await this.verifyRtWithDb(refreshToken)
    refreshToken = await this.jwtService.signRefreshToken({ secret: process.env.REFRESH_TOKEN_SECRET, payload: { userId: user?.id, roleId: user?.roleId } })
    const accessToken = await this.jwtService.signAccessToken({ secret: process.env.ACCESS_TOKEN_SECRET, payload: { userId: user?.id, roleId: user?.roleId } })
    const hashedRt = await bcrypt.hash(refreshToken, 10)
    user.hashedRt = hashedRt
    await this.userRepo.save(user)
    return {
      status: 200,
      accessToken,
      refreshToken
    }
  }

  private async verifyRtWithDb(rt: string): Promise<UserEntity> {
    const { roleId, userId } = await this.jwtService.verifyRefreshToken({ secret: process.env.REFRESH_TOKEN_SECRET, token: rt })
    const user = await this.userRepo.findOneBy({ id: userId, roleId })
    if (!user) throw new UnauthorizedException(AuthErrorMessage.loginAgain)
    if (!user.hashedRt || !await bcrypt.compare(rt, user.hashedRt)) throw new UnauthorizedException(AuthErrorMessage.loginAgain)
    return user
  }

  async logOut(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh-token']
    if(!refreshToken) throw new BadRequestException(AuthErrorMessage.alreadyLoggedOut)
    const payload =  await this.jwtService.verifyRefreshToken({secret : process.env.REFRESH_TOKEN_SECRET, token : refreshToken})
    const {userId, roleId} = payload
    const user = await this.userRepo.findOneBy({id : userId, roleId})
    if(!user) throw new BadRequestException(AuthErrorMessage.alreadyLoggedOut)
    if(!user.hashedRt) throw new BadRequestException(AuthErrorMessage.alreadyLoggedOut)
    user.hashedRt = null
    await this.userRepo.save(user)
    res.clearCookie("refresh-token", {
      httpOnly : true,
      sameSite :false, 
      secure : false
    })
    return {
      status : 200,
      message : AuthSuccessMessage.logout
    }
    } 


}

