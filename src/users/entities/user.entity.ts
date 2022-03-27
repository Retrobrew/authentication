import { Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Credentials } from './credentials.entity';

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

  @Embedded(
    () => Credentials,
    {
      prefix: false
    }
  )
  private credentials: Credentials;

  constructor(
    email: string,
    firstname: string,
    lastname: string,
    credentials: Credentials,
  ) {
    // Pas ouf à revoir : doit être l'orm/la bdd qui retourne l'identifiant
    this.uuid = randomUUID();

    this.credentials = credentials;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
  }

  changeEmail(email: string): void {
    this.email = email;
  }

  changeFirstname(firstname: string): void {
    this.firstname = firstname;
  }

  changeLastname(lastname: string): void {
    this.lastname = lastname;
  }

  getPassword(): string {
    return this.credentials.getPassword();
  }

  async changePassword(newPassword: string): Promise<void> {
    this.credentials.changePassword(newPassword)
  }

  getSalt(): string {
    return this.credentials.getSalt()
  }

}
