import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';
import { FriendRequestStatus } from '../friend-request-status';

@Entity()
export class FriendRequest {
  @PrimaryKey({ autoincrement: true })
  private id: number;

  @ManyToOne(() => User)
  private readonly requester: User;

  @ManyToOne(() => User)
  private readonly recipient: User;

  @Property()
  private sentAt: Date;

  @Enum({
    items: () => FriendRequestStatus,
    default: FriendRequestStatus.PENDING
  })
  private status: string;

  constructor(
    requester: User,
    recipient: User,
    sentAt: Date
  ) {
    this.requester = requester;
    this.recipient = recipient;
    this.sentAt = sentAt;
  }

  public getId(): number {
    return this.id;
  }
}