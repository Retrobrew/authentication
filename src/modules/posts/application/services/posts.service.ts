import { EntityRepository } from '@mikro-orm/mysql';
import { Post } from '../../domain/entities/post.entity';
import { EditPostDto } from '../dto/edit-post.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { CreatePostRequestDto } from '../dto/create-post-request.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../../users/application/services/users.service';

export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: EntityRepository<Post>,
    private readonly userRepository: UsersService
  ) {}

  async createPost(createPostRequest: CreatePostRequestDto): Promise<string> {
    const author = await this.userRepository.findOneByUuid(createPostRequest.authorId);
    if(!author){
      throw new BadRequestException("Utilisateur inconnu");
    }
    const createPostDto     =  new CreatePostDto();
    createPostDto.author    = author;
    createPostDto.createdAt = createPostRequest.createdAt;
    createPostDto.content   = createPostRequest.content;
    createPostDto.title     = createPostRequest.title;

    const post = Post.createPost(createPostDto);

    await this.postsRepository.persistAndFlush(post);

    return post.getUuid();
  }

  async editPost(editPostDto: EditPostDto): Promise<void> {
    const author = await this.userRepository.findOneByUuid(editPostDto.authorId);
    if(!author) {
      throw new BadRequestException("Utilisateur inconnu");
    }

    const post = await this.postsRepository.findOne({ uuid: editPostDto.postUuid });

    if(!post) {
      throw new BadRequestException("Post inconnu");
    }

    if(post.getAuthor().getUuid() != author.getUuid()) {
      throw new BadRequestException("Opération non permise");
    }

    if(editPostDto.changedTitle) {
      post.changeTitle(editPostDto.changedTitle);
    }

    if(editPostDto.changedContent) {
      post.changeContent(editPostDto.changedContent);
    }

    await this.postsRepository.persistAndFlush(post);
  }





}