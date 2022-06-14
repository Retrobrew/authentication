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
  private readonly adhesionDate: Date;

  constructor(user: User, group: Groups, adhesionDate: Date) {
    this.user = user;
    this.group = group;
    this.adhesionDate = adhesionDate;
  }
}
