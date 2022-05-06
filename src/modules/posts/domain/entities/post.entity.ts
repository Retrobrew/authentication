import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, TextType } from '@mikro-orm/core';
import { User } from '../../../users/domain/entities/user.entity';
import { randomUUID } from 'crypto';
import { PostRepository } from '../../application/post.repository';

@Entity({ customRepository: () => PostRepository })
export class Post {
  @PrimaryKey()
  private readonly uuid: string;

  @Property({ nullable: true })
  private title?: string;

  @ManyToOne()
  private readonly author: User;

  @Property({type: TextType})
  private content: string;

  @Property({ nullable: true })
  private media?: string;

  @OneToMany('Post', 'parent', { cascade: [Cascade.ALL] })
  private comments = new Collection<Post>(this);

  @ManyToOne(() => Post,{ nullable: true })
  private parent?: Post;

  @Property()
  private createdAt: Date;

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
  ): Post {
    const post =  new Post(
      author,
      content,
      createdAt
    );
    if(title) {
      post.title = title;
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

  changeTitle(newTitle: string): void {
    this.title = newTitle;
  }

  changeContent(changedContent: string): void {
    this.content = changedContent;
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




}