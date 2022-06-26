export class PostLikeDto {
  public readonly postUuid: string;
  public readonly userUuid: string;

  constructor(
    postUuid: string,
    userUuid: string
  ) {
    this.postUuid = postUuid;
    this.userUuid = userUuid;
  }
}