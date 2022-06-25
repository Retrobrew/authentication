import { AuthorDto } from '../../post/author.dto';

export class PostCommentsDto {
  public readonly uuid: string;
  public readonly title?: string;
  public readonly content: string;
  public readonly author: AuthorDto;
  public readonly lastUpdatedAt: Date;
  public readonly media?: string;

  constructor (
    uuid: string,
    title: string,
    content: string,
    author: AuthorDto,
    lastUpdatedAt: Date,
    media: string
  ) {
    this.uuid = uuid;
    this.title = title;
    this.content = content;
    this.author = author;
    this.lastUpdatedAt = lastUpdatedAt;
    this.media = media;
  }
}