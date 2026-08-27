import { AbstractEntity } from "src/common/abstract/entity.abstract";
import { EntityNames } from "src/common/enum/name.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { RoleEntity } from "./role.entity";

@Entity(EntityNames.permissions)
export class PermissionEntity extends AbstractEntity{
    @Column({unique : true})
    name : string
    @Column()
    roleId : number
    @ManyToOne(() => RoleEntity, role => role.permissions, {onDelete : "CASCADE"})
    role : RoleEntity
}