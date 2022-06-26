import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../users/domain/entities/user.entity';
import { GroupsMembership } from './groups-membership.entity';

export interface IGroups {
  uuid: string;
  name: string;
  picture: string;
  createdAt: Date;
  description: string;
  isProject: boolean;
  createdBy: User;
}

@Entity()
export class Groups {
  @PrimaryKey()
  uuid: string;

  @Property()
  private name: string;

  @Property({ nullable: true })
  picture: string;

  @Property({ nullable: true })
  createdAt: Date;

  @Property({ nullable: true })
  description: string;

  @Property({ default: false })
  isProject: boolean;

  @ManyToOne(() => User)
  private readonly createdBy: User;

  // @ts-ignore
  @OneToMany(() => GroupsMembership, gm => gm.group, { nullable: true })
  private members: Collection<GroupsMembership>;

  constructor(group: IGroups) {
    this.uuid = group.uuid;
    this.name = group.name;
    this.picture = group.picture;
    this.createdAt = group.createdAt;
    this.description = group.description;
    this.isProject = group.isProject;
    this.createdBy = group.createdBy;
  }

  public getCreator(): User {
    return this.createdBy;
  }

  public getName(): string {
    return this.name
  }

  public getMembers(): Array<User> {
    const members = [];
    this.members.getItems().forEach((membership) => {
      members.push(membership.getUser())
    });

    return members;
  }

  public getUuid(): string {
    return this.uuid;
  }
}
