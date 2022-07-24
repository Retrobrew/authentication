import { Collection, Embedded, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Credentials } from './credentials.entity';
import { UserRepository } from '../../application/user.repository';
import { FriendRequest } from './friend-request.entity';
import { Friendship } from './friendship.entity';
import { Post } from '../../../posts/domain/entities/post.entity';

@Entity({ customRepository: () => UserRepository })
export class User {

  public static readonly AVATAR_FILE_NAME = 'avatar.jpg';

  @PrimaryKey()
  private uuid: string;

  @Property()
  private email: string;

  @Property({ nullable: true })
  private dateOfBirth: Date;

  @Property()
  private sexe: string;

  @Property()
  private country: string;

  @Property()
  private username: string;

  @Property({ nullable: true })
  private picture: string;

  @Embedded(
    () => Credentials,
    {
      prefix: false
    }
  )
  private credentials: Credentials;

  // @ts-ignore
  @ManyToMany(() => Post, post => post.likes, { nullable: true })
  private likedPosts: Collection<Post>;

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
    this.picture = User.AVATAR_FILE_NAME;
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

  getGender(): string {
    return this.sexe
  }

  getDateOfBirth(): Date {
    return this.dateOfBirth;
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

  getFriends(): Array<User> {
    const friends = [];
    this.friends.getItems().forEach((user) => {
      friends.push(user.getFriendB())
    })

    return friends;
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

  getLikedPosts(): Array<Post> {
    return this.likedPosts.getItems();
  }

}
