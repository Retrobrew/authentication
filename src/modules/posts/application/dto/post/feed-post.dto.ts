import { AuthorDto } from './author.dto';

export class FeedPostDto {
  public readonly uuid: string;
  public readonly title: string;
  public readonly commentsNb: number;
  public readonly author: AuthorDto;
  public readonly content: string;
  public readonly createdAt: Date;

  constructor(
    uuid: string,
    title: string,
    commentsNb: number,
    author: AuthorDto,
    content: string,
    createdAt: Date
  ) {
    this.uuid = uuid;
    this.title = title;
    this.commentsNb = commentsNb;
    this.author = author;
    this.content = content;
    this.createdAt = createdAt;
  }
}