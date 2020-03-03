import { EntityRepository, Repository } from "typeorm";
import { Post } from "../entities/Post";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
    public async getPosts() {
        return this.createQueryBuilder("post")
            .leftJoinAndSelect("post.user", "user")
            .select(["post.id", "post.title", "post.previewContent", "post.createdAt", "user.email", "user.realName"])
            .orderBy("post.createdAt", "DESC")
            .getMany();
    }
}
