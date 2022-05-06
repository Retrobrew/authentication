import { Post } from '../../domain/entities/post.entity';
import { EditPostDto } from '../dto/post/edit-post.dto';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../../users/application/services/users.service';
import { PostRepository } from '../post.repository';
import { User } from '../../../users/domain/entities/user.entity';
import { DeletePostDto } from '../dto/post/delete-post.dto';

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
      createPostDto.createdAt,
      ""
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

  async deletePost(deletePostDto: DeletePostDto): Promise<void> {
    const user = await this.userRepository.findOneByUuid(deletePostDto.authorId);
    if(!user) {
      throw new BadRequestException("Utilisateur inconnu");
    }

    const post = await this.postsRepository.findOne({ uuid: deletePostDto.postId }, { populate: true });
    if(!post) {
      throw new BadRequestException("Publication non trouvée");
    }

    // à voir après avec les droits de modérations et les posts dans les groupes
    if(post.getAuthor().getUuid() != user.getUuid()) {
      throw new BadRequestException("Impossible de supprimer le post d'un autre utilisateur")
    }

    await this.postsRepository.removeAndFlush(post);
  }

  async getUserFeed(userId: string): Promise<void> {
    //TODO
    const user: User = await this.userRepository.findOneByUuid("d7ddd4b6-84bb-4b6d-8cc1-179e1fea1699");

    this.postsRepository.getUserFeed(user).then((res) => {

      console.log(res);
    });
  }


}