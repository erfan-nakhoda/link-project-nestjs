import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "../auth/guard/auth.guard";
import { CreateLinkDto, UpdateLinkDto } from "./dto/link.dto";
import { LinksService } from "./links.service";

@Controller("links")
@UseGuards(AuthGuard)
export class LinksController {
    constructor(private readonly linksService: LinksService) {}

    @Get()
    findAll(@Req() req: Request) { return this.linksService.findAll(req.user!.id); }

    @Post()
    create(@Req() req: Request, @Body() dto: CreateLinkDto) { return this.linksService.create(req.user!.id, dto); }

    @Patch(":id")
    update(@Req() req: Request, @Param("id", ParseIntPipe) id: number, @Body() dto: UpdateLinkDto) {
        return this.linksService.update(req.user!.id, id, dto);
    }

    @Delete(":id")
    remove(@Req() req: Request, @Param("id", ParseIntPipe) id: number) {
        return this.linksService.remove(req.user!.id, id);
    }
}
