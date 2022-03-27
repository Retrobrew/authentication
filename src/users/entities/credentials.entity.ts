import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class Credentials {

  @Property()
  private password: string;
  @Property()
  private salt: string;

  constructor(password: string, salt: string) {
    this.salt = salt;
    this.password = password;
  }

  getPassword(): string {
    return this.password;
  }

  changePassword(newPassword: string){
    this.password = newPassword;
  }

  getSalt(): string {
    return this.salt;
  }
}