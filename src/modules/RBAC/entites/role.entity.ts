import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { UserEntity } from "src/modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";
import { PermissionEntity } from "./permission.entity";

@Entity(EntityNames.roles)
export class RoleEntity extends AbstractEntity {
    @Column()
    name : string
    @Column()
    title : string
    @CreateDateColumn({type : "time with time zone"})
    created_at : Date
    @OneToMany(() => UserEntity, user => user.role)
    users : UserEntity[]
    @OneToMany(() => PermissionEntity, permission => permission.role)
    permissions : PermissionEntity[]
}