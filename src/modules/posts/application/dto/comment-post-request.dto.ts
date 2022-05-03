export class CommentPostRequestDto {
  readonly parent: string;
  readonly content: string;
  readonly createdAt: Date;
}