import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../common/guard/auth.guard";
import { RoleGuard } from "../../common/guard/role.guard";
import { Permissions, Role } from "src/common/decorator/role.decorator";
import { UserService } from "./users.service";
import { ChangePassDto, CreateUserDto, SetActivityDto, UpdateUserDto } from "./dto/user.dto";

@Controller('/user')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get('/get-all')
    // just admin can access to
    @Permissions('USER.READ')
    getUsers() {
        return this.userService.getUsers()
    }
    @Get("/whoami")
    whoAmI() {
        return this.userService.whoAmI()
    }
    @Post('/create')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }
    @Post('/set-activity/:id')
    @UseGuards(RoleGuard)
    @Permissions('USER.ACTIVITY')
    setUserActivity(@Param("id", new ParseIntPipe()) id: number, @Body() setActivityDto: SetActivityDto) {
        return this.userService.setUserActivity(id, setActivityDto)
    }
    @Put('/update/:id')
    @Permissions("USER.UPDATE")
    updateUser(@Param("id", new ParseIntPipe()) id: number, @Body() updateUserDto : UpdateUserDto) {
        return this.userService.updateUser(updateUserDto, id)
    }
    @Put('/update')
    updateUserByUser(@Body() updateUserDto : UpdateUserDto) {
        return this.userService.updateUser(updateUserDto)
    }
    @Delete('/delete/:id')
    @Permissions("USER.UPDATE")
    deleteUser(@Param("id", new ParseIntPipe()) id: number) {
        return this.userService.deleteUser(id)
    }
    @Delete('/delete')
    deleteUserByUser(@Param("id", new ParseIntPipe()) id: number) {
        return this.userService.deleteUser()
    }
    @Patch('/change-password/:id')
    @UseGuards(RoleGuard)
    @Role("ADMIN")
    changeUserPass(@Param("id", new ParseIntPipe()) id: number, @Body() changePassDto : ChangePassDto) {
        return this.userService.changeUserPass(id, changePassDto)
    }
}
