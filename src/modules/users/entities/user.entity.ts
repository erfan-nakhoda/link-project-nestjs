import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { RoleEntity } from "src/modules/RBAC/entites/role.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { LinkEntity } from "src/modules/links/entities/link.entity";
import { GroupEntity } from "src/modules/groups/entities/group.entity";
import { GroupUserEntity } from "src/modules/groups/entities/group-user.entity";
import { LinkUserEntity } from "src/modules/links/entities/link-user.entity";

@Entity(EntityNames.users)
export class UserEntity extends AbstractEntity {
    @Column({unique : true})
    username : string
    @Column()
    password : string
    @Column({default : true})
    isActive : boolean
    @Column({type : "text", nullable : true})
    hashedRt : string | null
    @Column()
    roleId : number
    @ManyToOne(() => RoleEntity, role => role.users, {onDelete : "SET NULL"})
    role : RoleEntity
    @ManyToOne(() => LinkUserEntity, linkUser => linkUser.users, {onDelete : "SET NULL", nullable : true})
    link_record: LinkEntity
    @ManyToOne(() => GroupUserEntity, groupUser => groupUser.users, {onDelete : "SET NULL", nullable : true})
    group_record: GroupEntity
    
}
