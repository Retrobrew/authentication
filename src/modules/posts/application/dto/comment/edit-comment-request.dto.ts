export class EditCommentRequestDto {
  readonly parent: string;
  readonly content: string;
  readonly updatedAt: Date;
}