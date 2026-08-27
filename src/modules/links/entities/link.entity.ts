import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityNames.links)
export class LinkEntity extends AbstractEntity {
    @Column()
    title: string;

    @Column({ type: "text" })
    url: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    userId: number;

    @Column({ nullable: true })
    groupId?: number;

    @ManyToOne(() => UserEntity, user => user.links, { onDelete: "CASCADE" })
    user: UserEntity;

    @ManyToOne(() => GroupEntity, group => group.links, { nullable: true, onDelete: "SET NULL" })
    group?: GroupEntity;
}
