import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity()
export class User {
  // [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  private uuid: string;

  @Property()
  private email: string;

  @Property()
  private firstname: string;

  @Property()
  private lastname: string;

  @Property()
  private password: string;

  constructor(
    email: string,
    firstname: string,
    lastname: string,
    password: string
  ) {
    // Pas ouf à revoir
    this.uuid = randomUUID();
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
  }

  getPassword(): string {
    return this.password;
  }

  changeEmail(email: string): void {
    this.email = email;
  }

  static emptyUser(): User {
    return new User(
      "",
      "",
      "",
      ""
    )
  }
}
