import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class CreateGroupDto {
    @ApiProperty()
    @IsString()
    @Length(1, 100)
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
