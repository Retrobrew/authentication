import {
  Cascade,
  Collection,
  Entity, ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  TextType,
} from '@mikro-orm/core';
import { User } from '../../../users/domain/entities/user.entity';
import { randomUUID } from 'crypto';
import { PostRepository } from '../../application/post.repository';
import { Groups } from '../../../groups/domain/entities/groups.entity';

@Entity({ customRepository: () => PostRepository })
export class Post {
  @PrimaryKey()
  private readonly uuid: string;

  @Property({ nullable: true })
  private title?: string;

  @ManyToOne(() => User)
  private readonly author: User;

  @Property({type: TextType})
  private content: string;

  @Property({ nullable: true })
  private media?: string;

  @OneToMany('Post', 'parent', { cascade: [Cascade.ALL] })
  private comments = new Collection<Post>(this);

  @ManyToOne(() => Post,{ nullable: true })
  private parent?: Post;

  // @ts-ignore
  @ManyToMany(() => User, 'likedPosts', { owner: true, nullable: true })
  private likes: Collection<User>;

  @Property()
  private createdAt: Date;

  @ManyToOne(() => Groups,{ nullable: true })
  private postedIn: Groups;

  @Property({ nullable: true })
  private lastUpdatedAt?: Date;

  private constructor(
    author: User,
    content: string,
    createdAt: Date
  ) {
    this.uuid = randomUUID();
    this.author = author;
    this.content = content;
    this.createdAt = createdAt;
  }

  static createPost(
    author: User,
    title: string,
    content: string,
    createdAt: Date,
    media: Buffer = null,
    postedIn: Groups
  ): Post {
    const post =  new Post(
      author,
      content,
      createdAt
    );
    if(title) {
      post.title = title;
    }
    if(media){
      post.media = randomUUID() + '.jpg';
    }

    if(postedIn){
      post.postedIn = postedIn
    }

    return post;
  }

  static createComment(
    author: User,
    parent: Post,
    content: string,
    createdAt: Date
  ): Post {
    const post = new Post(
      author,
      content,
      createdAt
    );

    post.parent = parent;

    return post;
  }


  getUuid(): string {
    return this.uuid;
  }

  getTitle(): string {
    return this.title;
  }

  changeTitle(newTitle: string): void {
    this.title = newTitle;
  }

  getContent(): string {
    return this.content;
  }

  changeContent(changedContent: string): void {
    this.content = changedContent;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getLastUpdatedAt(): Date {
    return this.lastUpdatedAt;
  }

  changeEditDate(editDate: Date): void {
    this.lastUpdatedAt = editDate;
  }

  getAuthor(): User {
    return this.author;
  }

  isComment(): boolean {
    return this.parent != undefined;
  }

  getPostedInGroup(): Groups {
    return this.postedIn;
  }

  getComments(): Array<Post> {
    return this.comments.getItems();
  }

  getMedia(): string {
    return this.media;
  }

  getLikes(): Array<User> {
    return this.likes.getItems()
  }

  addLike(user: User): void {
    this.likes.add(user);
  }

  unlike(user: User): void {
    this.likes.remove(user);
  }




}