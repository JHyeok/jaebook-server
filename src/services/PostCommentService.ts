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

  /**
   * 포스트의 댓글을 생성한다.
   * @param postId 포스트 Id
   * @param createPostCommentDto 포스트 댓글 생성 DTO
   * @param userId 사용자 Id
   */
  public async createPostComment(
    postId: string,
    createPostCommentDto: CreatePostCommentDto,
    userId: string,
  ): Promise<PostComment> {
    const postComment = createPostCommentDto.toEntity(postId, userId);

    return await this.postCommentRepository.save(postComment);
  }

  /**
   * 댓글의 답글을 생성한다.
   * @param postId 포스트 Id
   * @param createCommentReplyDto 포스트 댓글의 답글 생성 DTO
   * @param userId 사용자 Id
   * @param commentId 댓글 Id
   */
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

  /**
   * 포스트의 댓글의 총 개수와 댓글(답글을 제외한)들을 조회한다.
   * @param postId 포스트 Id
   */
  public async getCommentByPostId(postId: string) {
    const count = await this.postCommentRepository.count({
      where: {
        postId: postId,
        isDeleted: false,
      },
    });

    const comments = await this.postCommentRepository.getCommentsByPostId(
      postId,
    );

    return {
      count,
      comments,
    };
  }

  /**
   * 댓글의 답글을 조회한다.
   * @param postId 포스트 Id
   * @param commentId 댓글 Id
   */
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

  /**
   * 댓글을 수정한다.
   * @param postId 포스트 Id
   * @param commentId 댓글 Id
   * @param updatePostCommentDto 포스트 댓글 수정 DTO
   * @param userId 사용자 Id
   */
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

  /**
   * 댓글을 삭제한다.
   * @param postId 포스트 Id
   * @param commentId 댓글 Id
   * @param userId 사용자 Id
   */
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
      postCommentToDelete.text = "작성자에 의해 삭제된 댓글입니다.";
      postCommentToDelete.isDeleted = true;
      await this.postCommentRepository.save(postCommentToDelete);
      return true;
    }

    return false;
  }
}
