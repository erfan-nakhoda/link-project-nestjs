import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GroupEntity } from "./entities/group.entity";
import { CreateGroupDto, UpdateGroupDto } from "./dto/group.dto";

@Injectable()
export class GroupsService {
    constructor(@InjectRepository(GroupEntity) private readonly groupRepo: Repository<GroupEntity>) {}

    findAll(userId: number) {
        return this.groupRepo.find({ where: { userId }, relations: { links: true } });
    }

    create(userId: number, dto: CreateGroupDto) {
        return this.groupRepo.save(this.groupRepo.create({ ...dto, userId }));
    }

    async update(userId: number, id: number, dto: UpdateGroupDto) {
        const group = await this.findOwned(userId, id);
        if (dto.name && dto.name !== group.name) {
            const duplicate = await this.groupRepo.findOneBy({ userId, name: dto.name });
            if (duplicate) throw new ConflictException("Group name already exists");
        }
        Object.assign(group, dto);
        return this.groupRepo.save(group);
    }

    async remove(userId: number, id: number) {
        const group = await this.findOwned(userId, id);
        await this.groupRepo.remove(group);
        return { status: 200, message: "Group deleted successfully" };
    }

    private async findOwned(userId: number, id: number) {
        const group = await this.groupRepo.findOneBy({ id, userId });
        if (!group) throw new NotFoundException("Group not found");
        return group;
    }
}
