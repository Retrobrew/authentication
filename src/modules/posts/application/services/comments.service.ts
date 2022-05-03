import { CommentPostDto } from '../dto/comment-post.dto';
import { BadRequestException } from '@nestjs/common';
import { Post } from '../../domain/entities/post.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PostRepository } from '../post.repository';
import { UsersService } from '../../../users/application/services/users.service';

export class CommentsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: PostRepository,
    private readonly userRepository: UsersService
  ) {}

  async commentPost(commentPostDto: CommentPostDto): Promise<string> {
    const user = await this.userRepository.findOneByUuid(commentPostDto.author);

    if(!user) {
      throw new BadRequestException("Utilisateur inconnus")
    }

    const post = await this.postsRepository.findOne({uuid: commentPostDto.parent});
    if(!post){
      throw new BadRequestException("Cette publication n'existe pas")
    }

    const comment = Post.createComment(
      user,
      post,
      commentPostDto.content,
      commentPostDto.createdAt
    );

    await this.postsRepository.persistAndFlush(comment);

    return comment.getUuid();
  }
}