import { AuthorDto } from './author.dto';
import { PostedInDto } from './posted-in.dto';
import { Post } from '../../../domain/entities/post.entity';

export class FeedPostDto {
  public readonly uuid: string;
  public readonly title: string;
  public readonly commentsNb: number;
  public readonly author: AuthorDto;
  public readonly content: string;
  public readonly media: string;
  public readonly createdAt: Date;
  public readonly postedIn: PostedInDto;
  public readonly likedByUser: boolean;
  public readonly likesNb: number;

  constructor(
    uuid: string,
    title: string,
    commentsNb: number,
    author: AuthorDto,
    content: string,
    media: string,
    createdAt: Date,
    postedIn: PostedInDto = null,
    likedByUser: boolean,
    likesNb: number
  ) {
    this.uuid = uuid;
    this.title = title;
    this.commentsNb = commentsNb;
    this.author = author;
    this.content = content;
    this.media = media;
    this.createdAt = createdAt;
    this.postedIn = postedIn;
    this.likedByUser = likedByUser;
    this.likesNb = likesNb;
  }

  public static createFromPost(post: Post, likedByUser = false): FeedPostDto {
    const authorDto = new AuthorDto(
      post.getAuthor().getUuid(),
      post.getAuthor().getUsername(),
      post.getAuthor().getCountry()
    );
    const groupDto = new PostedInDto(post.getPostedInGroup());
    return new FeedPostDto(
      post.getUuid(),
      post.getTitle(),
      post.getComments().length,
      authorDto,
      post.getContent(),
      post.getMedia(),
      post.getCreatedAt(),
      groupDto,
      likedByUser,
      post.getLikes().length
    );
  }
}