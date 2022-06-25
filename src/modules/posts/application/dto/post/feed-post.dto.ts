import { AuthorDto } from './author.dto';
import { PostedInDto } from './posted-in.dto';

export class FeedPostDto {
  public readonly uuid: string;
  public readonly title: string;
  public readonly commentsNb: number;
  public readonly author: AuthorDto;
  public readonly content: string;
  public readonly media: Buffer;
  public readonly createdAt: Date;
  public readonly postedIn: PostedInDto;

  constructor(
    uuid: string,
    title: string,
    commentsNb: number,
    author: AuthorDto,
    content: string,
    media: Buffer,
    createdAt: Date,
    postedIn: PostedInDto = null
  ) {
    this.uuid = uuid;
    this.title = title;
    this.commentsNb = commentsNb;
    this.author = author;
    this.content = content;
    this.media = media;
    this.createdAt = createdAt;
    this.postedIn = postedIn;
  }
}