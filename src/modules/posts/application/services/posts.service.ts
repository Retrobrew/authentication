import { Post } from '../../domain/entities/post.entity';
import { EditPostDto } from '../dto/post/edit-post.dto';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../../users/application/services/users.service';
import { PostRepository } from '../post.repository';
import { User } from '../../../users/domain/entities/user.entity';

export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: PostRepository,
    private readonly userRepository: UsersService
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<string> {
    const author = await this.userRepository.findOneByUuid(createPostDto.author);
    if(!author){
      throw new BadRequestException("Utilisateur inconnu");
    }

    const post = Post.createPost(
      author,
      createPostDto.title,
      createPostDto.content,
      createPostDto.createdAt
    );

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

  async getUserPosts(userId: string): Promise<Array<Post>> {

    const user: User = await this.userRepository.findOneByUuid(userId);

    if(!user) {
      throw new BadRequestException("Utilisateur inconnu")
    }

    return this.postsRepository.find({ author: user })
  }

  async getPost(postId: string): Promise<Post> {
    return this.postsRepository.findOne({uuid: postId});
  }

  async getUserFeed(userId: string): Promise<void> {
    const user: User = await this.userRepository.findOneByUuid(userId);

    this.postsRepository.getUserFeed(user).then((res) => {

      console.log(res);
    });
  }


}