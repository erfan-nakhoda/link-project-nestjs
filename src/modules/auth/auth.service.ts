import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { loginAuthDto, signUpAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthErrorMessage, AuthSuccessMessage } from './enum/auth.message';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from "bcrypt"
import { RoleEntity } from '../RBAC/entites/role.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private userRepo : Repository<UserEntity>,
  @InjectRepository(RoleEntity) private roleRepo : Repository<RoleEntity>,
) {}

  async signUp(signUpDto: signUpAuthDto) {
    const {username, password, confirm_password} = signUpDto
    const regexp = /[^a-zA-z\.\-]/gmi
    if(username.match(regexp)) throw new BadRequestException(AuthErrorMessage.usernameInvalid)
    if(password !== confirm_password) throw new BadRequestException(AuthErrorMessage.confirmPasswordInvalid)
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, salt)
    const role = await this.roleRepo.findOneBy({name : "USER"})
    await this.userRepo.insert({
      username,
      password : hashedPass,
      roleId : role?.id
    })

    return {
      status : 201,
      message : AuthSuccessMessage.signup
    }
  }

  async logIn(loginDto : loginAuthDto) {
    const {username , password} = loginDto
    const user = await this.userRepo.findOneBy({username})
    if(!user) throw new NotFoundException(AuthErrorMessage.signUpDataInvalid)
    if(!bcrypt.compareSync(password,user.password)) throw new UnauthorizedException(AuthErrorMessage.signUpDataInvalid)
    
    return {
      status : 200,
      message : AuthSuccessMessage.login
    }
  }
}

