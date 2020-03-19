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

    public async getPostById(postId: string) {
        return this.createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .where("post.id = :postId", { postId })
            .getOne();
    }
}
