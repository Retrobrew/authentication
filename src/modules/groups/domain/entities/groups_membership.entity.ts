import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../users/domain/entities/user.entity';
import { Groups } from './groups.entity';

@Entity()
export class GroupsMembership {
  @PrimaryKey({ autoincrement: true })
  private id: string;

  @ManyToOne(() => User)
  private readonly user: User;

  @ManyToOne(() => Groups)
  private readonly group: Groups;

  @Property()
  private readonly adhesion_date: Date;

  constructor(id: string, user: User, group: Groups, adhesion_date: Date) {
    this.id = id;
    this.user = user;
    this.group = group;
    this.adhesion_date = adhesion_date;
  }
}
