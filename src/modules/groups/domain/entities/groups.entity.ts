import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../users/domain/entities/user.entity';

@Entity()
export class Groups {
  @PrimaryKey()
  private uuid: string;

  @Property()
  private name: string;

  @Property()
  private picture: string;

  @Property({ nullable: true })
  private createdAt: Date;

  @Property({ nullable: true })
  private description: string;

  @Property({ default: false })
  private isProject: boolean;

  @ManyToOne(() => User)
  private createdBy: User;
}
