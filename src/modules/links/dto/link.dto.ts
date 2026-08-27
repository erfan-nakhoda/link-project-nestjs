import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateLinkDto {
    @ApiProperty()
    @IsString()
    @Length(1, 200)
    title: string;

    @ApiProperty()
    @IsUrl({ require_tld: false })
    url: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    groupId?: number;
}

export class UpdateLinkDto extends PartialType(CreateLinkDto) {}
