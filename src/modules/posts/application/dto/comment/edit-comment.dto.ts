export class EditCommentDto {
  readonly author: string;
  readonly comment: string;
  readonly content: string;
  readonly updatedAt: Date;

  constructor(
    author: string,
    comment: string,
    content: string,
    updatedAt: Date
  ) {
    this.author    = author;
    this.comment   = comment;
    this.content   = content;
    this.updatedAt = updatedAt;
  }
}