import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
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
  langage: string;
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

  @Property({ default: false })
  langage: string;

  @ManyToOne(() => User)
  private readonly createdBy: User;

  @OneToMany(
    () => GroupsMembership,
    // @ts-ignore
    gm => gm.group,
    {
      nullable: true,
      cascade: [Cascade.REMOVE]
    },
  )
  private members: Collection<GroupsMembership>;

  constructor(group: IGroups) {
    this.uuid = group.uuid;
    this.name = group.name;
    this.picture = group.picture;
    this.createdAt = group.createdAt;
    this.description = group.description;
    this.isProject = group.isProject;
    this.createdBy = group.createdBy;
    this.langage = group.langage;
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
