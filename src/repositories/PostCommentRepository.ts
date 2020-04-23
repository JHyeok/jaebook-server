import { EntityRepository, Repository } from "typeorm";
import { PostComment } from "../entities/PostComment";

@EntityRepository(PostComment)
export class PostCommentRepository extends Repository<PostComment> {
  public async getCommentById(postId: string, commentId: string) {
    return this.createQueryBuilder("comment")
      .where("comment.postId = :postId AND comment.id = :commentId", {
        postId,
        commentId,
      })
      .getOne();
  }

  public async getCommentsByPostId(postId: string) {
    return this.createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.text",
        "comment.createdAt",
        "comment.postId",
        "comment.isReplies",
      ])
      .leftJoinAndSelect("comment.user", "user")
      .where("comment.postId = :postId", { postId })
      .andWhere("comment.depth = 0")
      .orderBy("comment.createdAt", "ASC")
      .getMany();
  }

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

  public async getCommentReplies(postId: string, commentId: string) {
    return this.createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.parent",
        "comment.depth",
        "comment.text",
        "comment.createdAt",
        "comment.postId",
      ])
      .leftJoinAndSelect("comment.user", "user")
      .where("comment.postId = :postId", { postId })
      .andWhere("comment.parent = :commentId", { commentId })
      .orderBy("comment.createdAt", "ASC")
      .getMany();
  }
}
