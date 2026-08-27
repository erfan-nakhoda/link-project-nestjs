import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { LinkEntity } from "../../links/entities/link.entity";

@Entity(EntityNames.groups)
export class GroupEntity extends AbstractEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity, user => user.groups, { onDelete: "CASCADE" })
    user: UserEntity;

    @OneToMany(() => LinkEntity, link => link.group)
    links: LinkEntity[];
}
