import { EntityRepository, Repository } from "typeorm";
import { PostComment } from "../entities/PostComment";

@EntityRepository(PostComment)
export class PostCommentRepository extends Repository<PostComment> {
    public async getCommentsByPostId(postId: string) {
        return this.createQueryBuilder("comment")
            .select(["comment.id", "comment.text", "comment.createdAt"])
            .leftJoinAndSelect("comment.user", "user")
            .orderBy("comment.createdAt", "ASC")
            .where("comment.postId = :postId", { postId })
            .getMany();
    }
}
