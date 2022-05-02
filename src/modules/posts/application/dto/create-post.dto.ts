import { User } from '../../../users/domain/entities/user.entity';

export class CreatePostDto {
  title: string;
  content: string;
  author: User;
  createdAt: Date;
}