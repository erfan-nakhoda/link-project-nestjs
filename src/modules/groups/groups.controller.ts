import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "../../common/guard/auth.guard";
import { CreateGroupDto, UpdateGroupDto } from "./dto/group.dto";
import { GroupsService } from "./groups.service";

@Controller("groups")
@UseGuards(AuthGuard)
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @Get('/get-all')
    findAll(@Req() req: Request) { return this.groupsService.findAll(req.user!.id); }

    @Post("/create")
    create(@Req() req: Request, @Body() dto: CreateGroupDto) { return this.groupsService.create(req.user!.id, dto); }

    @Patch("update/:id")
    update(@Req() req: Request, @Param("id", ParseIntPipe) id: number, @Body() dto: UpdateGroupDto) {
        return this.groupsService.update(req.user!.id, id, dto);
    }

    @Delete("/delete/:id")
    remove(@Req() req: Request, @Param("id", ParseIntPipe) id: number) {
        return this.groupsService.remove(req.user!.id, id);
    }
}
