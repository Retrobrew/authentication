export class DeletePostDto {
  readonly authorId: string;
  readonly postId: string;


  constructor(
    authorId: string,
    postId: string
  ) {
    this.authorId = authorId;
    this.postId = postId;
  }
}