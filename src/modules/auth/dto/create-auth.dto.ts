import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword, Length, Matches } from "class-validator";

export class signUpAuthDto {
    @ApiProperty()
    @Length(4, 15)
    @IsString()
    @Matches(/^[a-z0-9_.]+$/)
    username: string
    @ApiProperty()
    @IsString()
    @IsStrongPassword({
        minUppercase : 1,
        minSymbols : 1,
        minLength : 8
    })
    password: string
    @ApiProperty()
    confirm_password: string
}

export class loginAuthDto {
    @ApiProperty()
    @IsString()
    username : string
    @ApiProperty()
    @IsString()
    password : string
}
