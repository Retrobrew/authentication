import { Collection, Embedded, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Credentials } from './credentials.entity';
import { UserRepository } from '../../application/user.repository';
import { FriendRequest } from './friend-request.entity';
import { Friendship } from './friendship.entity';

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

  @OneToMany('FriendRequest', 'requester')
  private sentRequests = new Collection<FriendRequest>(this);

  @OneToMany('FriendRequest', 'recipient')
  private receivedRequests = new Collection<FriendRequest>(this);

  @OneToMany('Friendship', 'friendA')
  private friends = new Collection<Friendship>(this);

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

  getUuid(): string {
    return this.uuid;
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

  getFriendRequests() {
    return this.receivedRequests
  }

  getSentFriendRequests() {
    return this.sentRequests
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
