import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LinkEntity } from "./entities/link.entity";
import { GroupEntity } from "../groups/entities/group.entity";
import { CreateLinkDto, UpdateLinkDto } from "./dto/link.dto";

@Injectable()
export class LinksService {
    constructor(
        @InjectRepository(LinkEntity) private readonly linkRepo: Repository<LinkEntity>,
        @InjectRepository(GroupEntity) private readonly groupRepo: Repository<GroupEntity>,
    ) {}

    findAll(userId: number) {
        return this.linkRepo.find({ where: { userId }, relations: { group: true } });
    }

    async create(userId: number, dto: CreateLinkDto) {
        await this.validateGroup(userId, dto.groupId);
        return this.linkRepo.save(this.linkRepo.create({ ...dto, userId }));
    }

    async update(userId: number, id: number, dto: UpdateLinkDto) {
        const link = await this.findOwned(userId, id);
        await this.validateGroup(userId, dto.groupId);
        Object.assign(link, dto);
        return this.linkRepo.save(link);
    }

    async remove(userId: number, id: number) {
        const link = await this.findOwned(userId, id);
        await this.linkRepo.remove(link);
        return { status: 200, message: "Link deleted successfully" };
    }

    private async validateGroup(userId: number, groupId?: number) {
        if (groupId === undefined) return;
        const group = await this.groupRepo.findOneBy({ id: groupId, userId });
        if (!group) throw new NotFoundException("Group not found");
    }

    private async findOwned(userId: number, id: number) {
        const link = await this.linkRepo.findOneBy({ id, userId });
        if (!link) throw new NotFoundException("Link not found");
        return link;
    }
}
