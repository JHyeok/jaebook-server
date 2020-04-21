import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PostComment } from "../entities/PostComment";
import { PostCommentRepository } from "../repositories/PostCommentRepository";
import {
  CreatePostCommentDto,
  UpdatePostCommentDto,
  CreateCommentReplyDto,
} from "../dtos/PostCommentDto";

@Service()
export class PostCommentService {
  constructor(
    @InjectRepository()
    private postCommentRepository: PostCommentRepository,
  ) {}

  public async createPostComment(
    postId: string,
    createPostCommentDto: CreatePostCommentDto,
    userId: string,
  ): Promise<PostComment> {
    const postComment = createPostCommentDto.toEntity(postId, userId);

    return await this.postCommentRepository.save(postComment);
  }

  public async createCommentReply(
    postId: string,
    createCommentReplyDto: CreateCommentReplyDto,
    userId: string,
    commentId: string,
  ): Promise<PostComment> {
    const postCommentToUpdate = await this.postCommentRepository.getCommentById(
      postId,
      commentId,
    );

    if (postCommentToUpdate) {
      postCommentToUpdate.isReplies = true;
      await this.postCommentRepository.save(postCommentToUpdate);
    } else {
      return null;
    }

    const commentReply = createCommentReplyDto.toEntity(
      postId,
      userId,
      commentId,
    );

    return await this.postCommentRepository.save(commentReply);
  }

  public async getCommentByPostId(postId: string): Promise<PostComment[]> {
    return await this.postCommentRepository.getCommentsByPostId(postId);
  }

  public async getCommentReplies(
    postId: string,
    commentId: string,
  ): Promise<PostComment[]> {
    const postComment = await this.postCommentRepository.getCommentById(
      postId,
      commentId,
    );

    if (!postComment) {
      return null;
    }

    return await this.postCommentRepository.getCommentReplies(
      postId,
      commentId,
    );
  }

  public async updatePostComment(
    postId: string,
    commentId: string,
    updatePostCommentDto: UpdatePostCommentDto,
    userId: string,
  ): Promise<PostComment> {
    const postCommentToUpdate = await this.postCommentRepository.getCommentById(
      postId,
      commentId,
    );

    if (postCommentToUpdate?.userId === userId) {
      postCommentToUpdate.text = updatePostCommentDto.text;
      return await this.postCommentRepository.save(postCommentToUpdate);
    }

    return null;
  }

  public async deletePostComment(
    postId: string,
    commentId: string,
    userId: string,
  ): Promise<boolean> {
    const postCommentToDelete = await this.postCommentRepository.getCommentById(
      postId,
      commentId,
    );

    if (postCommentToDelete?.userId === userId) {
      await this.postCommentRepository.delete({ id: commentId });
      return true;
    }

    return false;
  }
}
