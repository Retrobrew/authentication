import { Post } from '../../domain/entities/post.entity';
import { EditPostDto } from '../dto/post/edit-post.dto';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../../../users/application/services/users.service';
import { PostRepository } from '../post.repository';
import { User } from '../../../users/domain/entities/user.entity';
import { DeletePostDto } from '../dto/post/delete-post.dto';
import { FeedPostDto } from '../dto/post/feed-post.dto';
import { AuthorDto } from '../dto/post/author.dto';
import { QueryOrder } from '@mikro-orm/core';
import { Groups } from '../../../groups/domain/entities/groups.entity';
import { GroupsService } from '../../../groups/application/services/groups.service';
import { PostedInDto } from '../dto/post/posted-in.dto';

export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: PostRepository,
    private readonly userRepository: UsersService,
    private readonly groupService: GroupsService
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<string> {
    const author = await this.userRepository.findOneByUuid(createPostDto.author);
    if(!author){
      throw new BadRequestException("Utilisateur inconnu");
    }
    let group = null;

    if(createPostDto.postedIn){
       group = await this.groupService.find(createPostDto.postedIn);
    }

    const post = Post.createPost(
      author,
      createPostDto.title,
      createPostDto.content,
      createPostDto.createdAt,
      createPostDto.media,
      group
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

  async getUserFeed(userId: string): Promise<Array<FeedPostDto>> {
    const user: User = await this.userRepository.findOneByUuid(userId);
    const friendsPosts = await this.postsRepository.getUserFeed(user);
    const userPosts: Array<Post> = await this.postsRepository
      .find(
        {author: user, parent: null},
        {fields: [
            // @ts-ignore
            'uuid', 'title', 'comments','author', 'createdAt', 'content', 'media', 'postedIn', { author: ['uuid', 'username']}, { comments: ['uuid']}
            // @ts-ignore
          ], orderBy: { createdAt: QueryOrder.DESC }
        }
      );
    const postsFeed: Array<FeedPostDto> = [];

    friendsPosts.forEach((post: any) => {
      const authorDto = new AuthorDto(
        post.authorId,
        post.author
      );
      const feedPost = new FeedPostDto(
        post.uuid,
        post.title,
        0,
        authorDto,
        post.content,
        null,
        post.createdAt,
        post.postedIn?.uuid
      );
      postsFeed.push(feedPost);
    })

    userPosts.forEach((post: any) => {
      const authorDto = new AuthorDto(
        post.author.getUuid(),
        post.author.username
      );
      const feedPost = new FeedPostDto(
        post.uuid,
        post.title,
        post.comments.length,
        authorDto,
        post.content,
        post.media,
        post.createdAt,
        post.postedIn?.uuid
      );
      postsFeed.push(feedPost);
    })

    // @ts-ignore
    postsFeed.sort( (post, otherPost) => post.createdAt - otherPost.createdAt)

    return postsFeed.reverse();
  }

  async getHomeFeed(): Promise<Array<FeedPostDto>> {
    const posts  = await this.postsRepository.getHomeFeed();
    const feedPosts: Array<FeedPostDto> = [];

    posts.forEach((post: any) => {
      const authorDto = new AuthorDto(
        post.author.uuid,
        post.author.username
      );

      let postedInDto = null;

      if(post.postedIn){
        postedInDto = new PostedInDto(
          post.postedIn.uuid,
          post.postedIn.name
        )
      }

      const feedPost = new FeedPostDto(
        post.uuid,
        post.title,
        post.comments.length,
        authorDto,
        post.content,
        null,
        post.createdAt,
        post.postedIn?.uuid,
        postedInDto
      );
      feedPosts.push(feedPost);

    })

    return feedPosts;
  }

  async getGroupFeed(group: Groups){
    const posts = await this.postsRepository.getGroupFeed(group);
    const feedPosts: Array<FeedPostDto> = [];

    posts.forEach((post: any) => {
      const authorDto = new AuthorDto(
        post.author.uuid,
        post.author.username
      );

      const feedPost = new FeedPostDto(
        post.uuid,
        post.title,
        post.comments.length,
        authorDto,
        post.content,
        null,
        post.createdAt,
        post.postedIn?.uuid
      );
      feedPosts.push(feedPost);

    })

    return feedPosts;
  }


}