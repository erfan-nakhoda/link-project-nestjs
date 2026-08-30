import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";
import { GroupEntity } from "./group.entity";

@Entity(EntityNames.groupUser)
export class GroupUserEntity extends AbstractEntity {
    @Column()
    userId : number
    @Column()
    groupId : number
    @CreateDateColumn()
    created_at : Date
    @OneToMany(() => UserEntity, user => user.group_record, {onDelete : "CASCADE"})
    users : UserEntity[]
    @OneToMany(() => GroupEntity, group => group.user_record, {onDelete : "CASCADE"})
    groups : GroupEntity[]
}