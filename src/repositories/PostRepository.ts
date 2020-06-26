import { EntityRepository, Repository } from "typeorm";
import { Post } from "../entities/Post";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  /**
   * 포스트 목록을 조회한다.
   * @param offset offset
   * @param limit limit
   */
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

  /**
   * 주간에 점수(post.score)가 높은 인기글 목록을 조회한다.
   * @param offset offset
   * @param limit limit
   * @param createdAtBeforeWeek 일주일
   */
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

  /**
   * 포스트 정보를 조회한다.
   * @param postId 포스트 Id
   */
  public async getPostById(postId: string) {
    return this.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .where("post.id = :postId", { postId })
      .getOne();
  }

  /**
   * 사용자가 작성한 포스트 목록을 조회한다.
   * @param userId 사용자 Id
   */
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
