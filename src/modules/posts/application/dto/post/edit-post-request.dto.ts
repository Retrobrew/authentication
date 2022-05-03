export class EditPostDto {
  readonly changedTitle: string;
  readonly changedContent: string;
  readonly dateOfUpdate: Date;
  readonly authorId: string;
}