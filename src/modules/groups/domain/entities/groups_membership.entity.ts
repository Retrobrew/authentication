import { Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "src/modules/users/domain/entities/user.entity";
import { Groups } from "./groups.entity";

@Entity()
export class GroupsMembership {
    @PrimaryKey({autoincrement: true})
    private id: number;

    @ManyToOne(() => User)
    private readonly user: User;

    @ManyToOne(() => Groups)
    private readonly group: Groups;

    @Property()
    private readonly adhesion_date: Date;

}