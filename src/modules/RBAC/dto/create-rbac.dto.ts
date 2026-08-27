import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Matches } from "class-validator";

export class CreatePermissionDto  {
    @ApiProperty()
    @IsInt()
    roleId : number
    @ApiProperty()
    @IsString()
    @Matches(/^([A-Z]+):([A-Z]+)$/, {message : "نام مجوز باید به صورت وارد شود EXAMPLE:EXAMPLE"})
    name : string
}
export class CreateRoleDto  {
    @ApiProperty()
    @IsString()
    name : string
    @ApiProperty()
    @IsString()
    title : string
}
