import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { RoleEntity } from "src/modules/RBAC/entites/role.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { LinkEntity } from "src/modules/links/entities/link.entity";
import { GroupEntity } from "src/modules/groups/entities/group.entity";

@Entity(EntityNames.users)
export class UserEntity extends AbstractEntity {
    @Column({unique : true})
    username : string
    @Column()
    password : string
    @Column({default : true})
    isActive : boolean
    @Column()
    roleId : number
    @ManyToOne(() => RoleEntity, role => role.users, {onDelete : "SET NULL"})
    role : RoleEntity
    @OneToMany(() => LinkEntity, link => link.user)
    links: LinkEntity[]
    @OneToMany(() => GroupEntity, group => group.user)
    groups: GroupEntity[]
    
}
