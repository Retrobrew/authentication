
export class CreatePostRequestDto {
  readonly title: string;
  readonly content: string;
  readonly authorId: string;
  readonly createdAt: Date;
}