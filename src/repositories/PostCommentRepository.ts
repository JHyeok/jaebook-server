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
            ])
            .leftJoinAndSelect("comment.user", "user")
            .orderBy("comment.createdAt", "ASC")
            .where("comment.postId = :postId", { postId })
            .getMany();
    }
}
