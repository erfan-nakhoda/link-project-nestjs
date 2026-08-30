import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { LinkEntity } from "../../links/entities/link.entity";
import { GroupUserEntity } from "./group-user.entity";

@Entity(EntityNames.groups)
export class GroupEntity extends AbstractEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    userId: number;

    @ManyToOne(() => GroupUserEntity, groupUser => groupUser.groups, {onDelete : "SET NULL"})
    user_record: UserEntity;

    @OneToMany(() => LinkEntity, link => link.group)
    links: LinkEntity[];
}
