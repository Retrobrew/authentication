import { Collection, Embedded, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Credentials } from './credentials.entity';
import { UserRepository } from '../../application/user.repository';
import { FriendRequest } from './friend-request.entity';
import { Friendship } from './friendship.entity';

@Entity({ customRepository: () => UserRepository })
export class User {

  @PrimaryKey()
  private uuid: string;

  @Property()
  private email: string;

  @Property({nullable: true})
  private dateOfBirth: Date;

  @Property()
  private sexe: string;

  @Property()
  private country: string;

  @Property()
  private username: string;

  @Property({nullable: true})
  private picture: string;

  @Embedded(
    () => Credentials,
    {
      prefix: false
    }
  )
  private credentials: Credentials;

  @OneToMany('FriendRequest', 'requester')
  private sentRequests = new Collection<FriendRequest>(this);

  @OneToMany('FriendRequest', 'recipient')
  private receivedRequests = new Collection<FriendRequest>(this);

  @OneToMany('Friendship', 'friendA')
  private friends = new Collection<Friendship>(this);

  constructor(
    email: string,
    username: string,
    dateOfBirth: Date,
    sexe: string,
    country: string,
    credentials: Credentials,
  ) {
    this.uuid = randomUUID();
    this.credentials = credentials;
    this.email = email;
    this.username = username;
    this.dateOfBirth = dateOfBirth;
    this.sexe = sexe;
    this.country = country;
  }

  getUuid(): string {
    return this.uuid;
  }

  getEmail(): string {
    return this.email
  }

  changeEmail(email: string): void {
    this.email = email;
  }

  getUsername(): string {
    return this.username;
  }

  changeUsername(lastname: string): void {
    this.username = lastname;
  }

  getCountry(): string {
    return this.country;
  }

  getPicture(): string {
    return this.picture;
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

  getFriendRequests() {
    return this.receivedRequests
  }

  getSentFriendRequests() {
    return this.sentRequests
  }

  hasSentRequestTo(user: User): boolean {
     return !!this.sentRequests.getItems().find((request) => {
       return request.getRecipient().getUuid() == user.getUuid()
     })
  }

  isFriendWith(user: User): boolean {
    const friendship = this.friends.getItems().find((friendship) => {
      return friendship.getFriendB().uuid == user.uuid;
    });

    return !!friendship;
  }

  getFriends() {
    return this.friends
  }

  addFriend(friend: User) {
    const startDate = new Date();
    const friendship = new Friendship(
      this,
      friend,
      startDate
    );
    this.friends.add(friendship);
  }

}
