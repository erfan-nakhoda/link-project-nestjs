import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guard/auth.guard";
import { RoleGuard } from "../RBAC/guard/role.guard";
import { Role } from "src/common/decorator/role.decorator";
import { UserService } from "./users.service";
import { ChangePassDto, CreateUserDto, SetActivityDto, UpdateUserDto } from "./dto/user.dto";

@Controller('/user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get('/getAll')
    // just admin can access to
    getUsers() {
        return this.userService.getUsers()
    }
    @Post('/create')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto.username, createUserDto.password)
    }
    @Post('/set-activity/:id')
    @UseGuards(RoleGuard)
    @Role("ADMIN")
    setUserActivity(@Param("id", new ParseIntPipe()) id: number, @Body() setActivityDto: SetActivityDto) {
        return this.userService.setUserActivity(id, setActivityDto)
    }
    @Put('/update/:id')
    updateUser(@Param("id", new ParseIntPipe()) id: number, @Body() updateUserDto : UpdateUserDto) {
        return this.userService.updateUser(id, updateUserDto)
    }
    @Delete('/delete/:id')
    deleteUser(@Param("id", new ParseIntPipe()) id: number) {
        return this.userService.deleteUser(id)
    }
    @Patch('/update/:id')
    @UseGuards(RoleGuard)
    @Role("ADMIN")
    changeUserPass(@Param("id", new ParseIntPipe()) id: number, @Body() changePassDto : ChangePassDto) {
        return this.userService.changeUserPass(id, changePassDto)
    }
}
