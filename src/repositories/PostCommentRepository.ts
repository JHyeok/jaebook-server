import { EntityRepository, Repository } from "typeorm";
import { PostComment } from "../entities/PostComment";

@EntityRepository(PostComment)
export class PostCommentRepository extends Repository<PostComment> {
  /**
   * 포스트 Id와 댓글 Id가 일치하는 댓글 정보를 조회한다.
   * @param postId 포스트 Id
   * @param commentId 댓글 Id
   */
  public async getCommentById(postId: string, commentId: string) {
    return this.createQueryBuilder("comment")
      .where("comment.id = :commentId", { commentId })
      .andWhere("comment.postId = :postId", { postId })
      .getOne();
  }

  /**
   * 포스트 Id가 일치하며 답글을 제외한 댓글들을 조회한다.
   * @param postId 포스트 Id
   */
  public async getCommentsByPostId(postId: string) {
    return this.createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.text",
        "comment.createdAt",
        "comment.postId",
        "comment.isReplies",
        "comment.isDeleted",
      ])
      .leftJoinAndSelect("comment.user", "user")
      .where("comment.postId = :postId", { postId })
      .andWhere("comment.depth = :value", { value: 0 })
      .orderBy("comment.createdAt", "ASC")
      .getMany();
  }

  /**
   * 사용자가 작성한 삭제되지 않은 댓글과 답글들을 조회한다.
   * @param userId 사용자 Id
   */
  public async getCommentsByUserId(userId: string) {
    return this.createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.text",
        "comment.createdAt",
        "comment.postId",
      ])
      .where("comment.userId = :userId", { userId })
      .andWhere("comment.isDeleted = :value", { value: false })
      .orderBy("comment.createdAt", "DESC")
      .getMany();
  }

  /**
   * 포스트 Id와 댓글 Id가 일치하는 댓글의 답글들을 조회한다.
   * @param postId 포스트 Id
   * @param commentId 댓글 Id
   */
  public async getCommentReplies(postId: string, commentId: string) {
    return this.createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.parent",
        "comment.depth",
        "comment.text",
        "comment.createdAt",
        "comment.postId",
        "comment.isDeleted",
      ])
      .leftJoinAndSelect("comment.user", "user")
      .where("comment.postId = :postId", { postId })
      .andWhere("comment.parent = :commentId", { commentId })
      .orderBy("comment.createdAt", "ASC")
      .getMany();
  }
}
