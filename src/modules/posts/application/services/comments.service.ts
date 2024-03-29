import { CommentPostDto } from '../dto/comment/comment-post/comment-post.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Post } from '../../domain/entities/post.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PostRepository } from '../post.repository';
import { UsersService } from '../../../users/application/services/users.service';
import { EditCommentDto } from '../dto/comment/edit-comment/edit-comment.dto';
import { DeleteCommentDto } from '../dto/comment/delete-comment/delete-comment.dto';
import { PostCommentsDto } from '../dto/comment/read-comments/post-comments.dto';
import { AuthorDto } from '../dto/post/author.dto';

export class CommentsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: PostRepository,
    private readonly usersService: UsersService
  ) {}

  async getPostComments(postUuid: string): Promise<Array<PostCommentsDto>> {
    const post = await this.postsRepository.findOne(
      { uuid: postUuid },
      {
        // @ts-ignore
        fields: ['comments', { comments: ['uuid', 'title', 'content', 'author',{author: ['uuid', 'username','picture', 'country']}, 'lastUpdatedAt', 'media']}]
      }
    );

    if(!post) {
      throw new NotFoundException("Post not found")
    }

    const commentsDto = [];

    post.getComments()
      .forEach((comment) => {
        const authorDto = new AuthorDto(
          comment.getAuthor().getUuid(),
          comment.getAuthor().getUsername(),
          comment.getAuthor().getCountry()
        );

        const postComment = new PostCommentsDto(
          comment.getUuid(),
          comment.getTitle(),
          comment.getContent(),
          authorDto,
          comment.getLastUpdatedAt(),
          comment.getMedia()
        );

        commentsDto.push(postComment);
      })

    return commentsDto;
  }

  async commentPost(commentPostDto: CommentPostDto): Promise<string> {
    const user = await this.usersService.findOneByUuid(commentPostDto.author);

    if(!user) {
      throw new BadRequestException("Utilisateur inconnus")
    }

    const post = await this.postsRepository.findOne({ uuid: commentPostDto.parent });
    if(!post){
      throw new BadRequestException("Cette publication n'existe pas")
    }

    if(post.isComment()) {
      throw new BadRequestException("Impossible de commenter un commentaire (pour l'instant)")
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

  async editComment(editCommentDto: EditCommentDto): Promise<void> {
    const user = await this.usersService.findOneByUuid(editCommentDto.author);
    if(!user) {
      throw new BadRequestException("Utilisateur inconnu");
    }

    const comment = await this.postsRepository.findOne({uuid: editCommentDto.comment});

    if(!comment) {
      throw new BadRequestException("Non trouvé");
    }
    const userIsAuthor: boolean = comment.getAuthor().getUuid() == user.getUuid();

    if(!userIsAuthor) {
      throw new BadRequestException(
        "Impossible de modifier un commentaire qui n'est pas le sien"
      );
    }

    if(!comment.isComment()) {
      throw new BadRequestException("Pas un commentaire");
    }

    comment.changeContent(editCommentDto.content);
    //Value Object pour editDate ?? pour vérifier la validité de la date
    comment.changeEditDate(editCommentDto.updatedAt);

    await this.postsRepository.persistAndFlush(comment);
  }

  async deleteComment(deleteCommentDto: DeleteCommentDto): Promise<void> {
    const user = await this.usersService.findOneByUuid(deleteCommentDto.userId);
    if(!user) {
      throw new BadRequestException("Utilisateur inconnu");
    }

    const comment = await this.postsRepository.findOne({uuid: deleteCommentDto.commentId});

    if(!comment) {
      throw new BadRequestException("Non trouvé");
    }

    const userIsAuthor: boolean = comment.getAuthor().getUuid() == user.getUuid();

    if(!userIsAuthor) {
      throw new BadRequestException(
        "Impossible de supprimer un commentaire qui n'est pas le sien"
      );
    }

    if(!comment.isComment()) {
      throw new BadRequestException("Pas un commentaire");
    }

    await this.postsRepository.removeAndFlush(comment);

  }
}