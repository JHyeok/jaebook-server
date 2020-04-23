import { EntityRepository, Repository } from "typeorm";
import { Post } from "../entities/Post";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  public async getPosts(offset: number, limit: number) {
    return this.createQueryBuilder("post")
      .select([
        "post.id",
        "post.title",
        "post.previewContent",
        "post.createdAt",
        "post.view",
        "post.like",
      ])
      .leftJoinAndSelect("post.user", "user")
      .orderBy("post.createdAt", "DESC")
      .skip(offset)
      .take(limit)
      .getMany();
  }

  public async getBestPosts(
    offset: number,
    limit: number,
    createdAtBeforeWeek: Date,
  ) {
    return this.createQueryBuilder("post")
      .select([
        "post.id",
        "post.title",
        "post.previewContent",
        "post.createdAt",
        "post.view",
        "post.like",
        "post.score",
      ])
      .leftJoinAndSelect("post.user", "user")
      .where("post.createdAt >= :createdAtBeforeWeek", {
        createdAtBeforeWeek,
      })
      .orderBy("post.score", "DESC")
      .skip(offset)
      .take(limit)
      .getMany();
  }

  public async getPostById(postId: string) {
    return this.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .where("post.id = :postId", { postId })
      .getOne();
  }

  public async getPostsByUserId(userId: string) {
    return this.createQueryBuilder("post")
      .select([
        "post.id",
        "post.title",
        "post.previewContent",
        "post.createdAt",
        "post.view",
        "post.like",
      ])
      .where("post.userId = :userId", { userId })
      .orderBy("post.createdAt", "DESC")
      .getMany();
  }
}
