import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { LinkEntity } from "./link.entity";

@Entity(EntityNames.linkUser)
export class LinkUserEntity extends AbstractEntity{
    @Column()
    userId : number
    @Column()
    linkId : number
    @OneToMany(() => UserEntity, user => user.link_record, {onDelete : "CASCADE"})
    users : UserEntity[]
    @OneToMany(() => LinkEntity, link => link.user_record, {onDelete : "CASCADE"})
    links : LinkEntity[]
}