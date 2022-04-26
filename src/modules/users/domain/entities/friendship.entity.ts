import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Friendship {
  @PrimaryKey({autoincrement: true})
  private id: number;

  @ManyToOne(() => User)
  private readonly friendA: User;

  @ManyToOne(() => User)
  private readonly friendB: User;

  @Property()
  private readonly startDate: Date;

  constructor(
    friendA: User,
    friendB: User,
    startDate: Date
  ) {
    this.friendA = friendA;
    this.friendB = friendB;
    this.startDate = startDate;
  }

  getFriendB(): User {
    return this.friendB
  }
}