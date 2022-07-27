import { UserDto } from '../friend/user.dto';

export class FriendRequestDto {
  public readonly id: number;
  public readonly requester: UserDto;
  public readonly sentAt: Date;
  public readonly status: string;


  constructor(
    requestId: number,
    requesterDto: UserDto,
    sentAt: Date,
    status: string
  ) {
    this.id = requestId;
    this.requester = requesterDto;
    this.sentAt = sentAt;
    this.status = status;
  }
}