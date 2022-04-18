import { Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Credentials } from './credentials.entity';
import { UserRepository } from '../../application/user.repository';

@Entity({ customRepository: () => UserRepository })
export class User {
  // [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  private uuid: string;

  @Property()
  private email: string;

  @Property()
  private username: string;

  @Embedded(
    () => Credentials,
    {
      prefix: false
    }
  )
  private credentials: Credentials;

  constructor(
    email: string,
    username: string,
    credentials: Credentials,
  ) {
    // Pas ouf à revoir : doit être l'orm/la bdd qui retourne l'identifiant
    this.uuid = randomUUID();

    this.credentials = credentials;
    this.email = email;
    this.username = username;
  }

  changeEmail(email: string): void {
    this.email = email;
  }

  changeUsername(lastname: string): void {
    this.username = lastname;
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
