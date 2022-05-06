import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../users/domain/entities/user.entity';

@Entity()
export class Groups {
  @PrimaryKey()
  uuid: string;

  @Property()
  name: string;

  @Property()
  picture: string;

  @Property({ nullable: true })
  createdAt: Date;

  @Property({ nullable: true })
  description: string;

  @Property({ default: false })
  isProject: boolean;

  @ManyToOne(() => User)
  createdBy: User;

  constructor(
    uuid: string,
    name: string,
    picture: string,
    createdAt: Date,
    description: string,
    isProject: boolean,
    createdBy: User,
  ) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.createdAt = createdAt;
    this.description = description;
    this.isProject = isProject;
    this.createdBy = createdBy;
  }
}
