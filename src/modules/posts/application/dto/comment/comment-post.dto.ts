export class CommentPostDto {
  readonly author: string;
  readonly parent: string;
  readonly content: string;
  readonly createdAt: Date;


  constructor(
    author: string,
    parent: string,
    content: string,
    createdAt: Date
  ) {
    this.author    = author;
    this.parent    = parent;
    this.content   = content;
    this.createdAt = createdAt;
  }
}