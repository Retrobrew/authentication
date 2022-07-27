import { Post } from '../../domain/entities/post.entity';
import { EditPostDto } from '../dto/post/edit-post/edit-post.dto';
import { CreatePostDto } from '../dto/post/create-post/create-post.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../../users/application/services/users.service';
import { PostRepository } from '../post.repository';
import { User } from '../../../users/domain/entities/user.entity';
import { DeletePostDto } from '../dto/post/delete-post.dto';
import { FeedPostDto } from '../dto/post/feed-post.dto';
import { Groups } from '../../../groups/domain/entities/groups.entity';
import { GroupsService } from '../../../groups/application/services/groups.service';
import { PostLikeDto } from '../dto/post/post-like.dto';
import { QueryOrder } from '@mikro-orm/core';
import * as fs from 'fs';


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

    if(createPostDto.media) {
      const feedStorage = process.env.HOME_FEED_STORAGE;
      const mediaPath = feedStorage + post.getMedia();

      if(!fs.existsSync(feedStorage)) {
        fs.mkdirSync(feedStorage, { recursive: true })
      }
      fs.writeFile(mediaPath, createPostDto.media, function(err){
        console.log(err);
      });
    }


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

  async getUserPosts(userId: string): Promise<Array<FeedPostDto>> {
    const user: User = await this.userRepository.findOneByUuid(userId);

    if(!user) {
      throw new BadRequestException("Utilisateur inconnu")
    }
    const postsDto = [];
    const posts = await this.postsRepository.find(
      { author: user },
      {
        fields: [
          // @ts-ignore
          'uuid', 'author', { author: ['uuid', 'username', 'picture', 'country'] }, 'title', 'content', 'createdAt', 'parent', 'postedIn', { postedIn: ['uuid', 'name'] }, 'comments', { comments: ['uuid', 'title'] }, 'likes',
        ],
        // @ts-ignore
        orderBy: { createdAt: QueryOrder.DESC }
      }
    )
    posts.forEach((post: Post) => {
      const likedByUser = post.getLikes().includes(user);
      postsDto.push(FeedPostDto.createFromPost(post, likedByUser));
    })
    return postsDto;
  }

  async getPost(postId: string, userId?: string): Promise<FeedPostDto> {
    const post = await this.postsRepository.findOne(
      { uuid: postId },
      { fields: [
          // @ts-ignore
          'uuid', 'author', { author: ['uuid', 'username', 'picture', 'country'] }, 'title', 'content', 'createdAt', 'parent', 'postedIn', { postedIn: ['uuid', 'name'] }, 'comments', { comments: ['uuid', 'title'] }, 'likes', 'media',
        ] }
    );

    if(!post) {
      throw new NotFoundException("This post does not exists");
    }
    let likedByUser = false;

    if(userId) {
      const user: User = await this.userRepository.findOneByUuid(userId);
      likedByUser = post.getLikes().includes(user);
      if(!user) {
        throw new NotFoundException("User not found");
      }
    }

    return FeedPostDto.createFromPost(post, likedByUser);
  }

  async likePost(postLikeDto: PostLikeDto): Promise<void> {
    const user = await this.userRepository.findOneByUuid(postLikeDto.userUuid);
    if(!user){
      throw new NotFoundException("User not found");
    }

    const post = await this.postsRepository
      .findOne({ uuid: postLikeDto.postUuid }, { populate: true })
    ;
    if(!post){
      throw new NotFoundException("User not found");
    }

    post.addLike(user);

    await this.postsRepository.persistAndFlush(post)
  }

  async unlikePost(postLikeDto: PostLikeDto): Promise<void> {
    const user = await this.userRepository.findOneByUuid(postLikeDto.userUuid);
    if(!user){
      throw new NotFoundException("User not found");
    }

    const post = await this.postsRepository
      .findOne({ uuid: postLikeDto.postUuid }, { populate: true })
    ;
    if(!post){
      throw new NotFoundException("User not found");
    }

    post.unlike(user);

    await this.postsRepository.persistAndFlush(post)
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
    const postsFeed: Array<FeedPostDto> = [];

    friendsPosts.forEach((post: Post) => {
      const likedByUser = post.getLikes().includes(user);
      postsFeed.push(FeedPostDto.createFromPost(post, likedByUser));
    })

    // @ts-ignore
    postsFeed.sort( (post, otherPost) => post.createdAt - otherPost.createdAt)

    return postsFeed.reverse();
  }

  async getHomeFeed(): Promise<Array<FeedPostDto>> {
    const posts  = await this.postsRepository.getHomeFeed();
    const feedPosts: Array<FeedPostDto> = [];

    posts.forEach((post: Post) => {
      feedPosts.push(FeedPostDto.createFromPost(post, false));
    })

    return feedPosts;
  }

  async getGroupFeed(group: Groups, userUuid: string): Promise<FeedPostDto[]>{
    const user: User = await this.userRepository.findOneByUuid(userUuid);
    const posts = await this.postsRepository.getGroupFeed(group);
    const feedPosts: Array<FeedPostDto> = [];

    posts.forEach((post: Post) => {
      const likedByUser = post.getLikes().includes(user);
      feedPosts.push(FeedPostDto.createFromPost(post,likedByUser));
    })

    return feedPosts;
  }


}