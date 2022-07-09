import { UserDto } from '../friend/user.dto';

export class FriendRequestDto {
  public readonly requestId: number;
  public readonly requesterDto: UserDto;
  public readonly sentAt: Date;
  public readonly status: string;


  constructor(
    requestId: number,
    requesterDto: UserDto,
    sentAt: Date,
    status: string
  ) {
    this.requestId = requestId;
    this.requesterDto = requesterDto;
    this.sentAt = sentAt;
    this.status = status;
  }
}