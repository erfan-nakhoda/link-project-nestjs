import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Length, Matches, IsStrongPassword, IsNumberString } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @Length(4, 15)
    @Matches(/^[a-z0-9_.]+$/)
    username: string;

    @ApiProperty()
    @IsString()
    @IsStrongPassword({ minLength: 8, minUppercase: 1, minSymbols: 1 })
    password: string;

    @ApiPropertyOptional()
    @IsNumberString()
    roleId? : string
}

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsString()
    @Length(4, 15)
    @Matches(/^[a-z0-9_.]+$/)
    username : string
}

export class ChangePassDto {
    @ApiProperty()
    @IsString()
    @IsStrongPassword()
    password : string
}

export class SetActivityDto {
    @ApiProperty()
    @IsBoolean()
    active  : boolean
}
