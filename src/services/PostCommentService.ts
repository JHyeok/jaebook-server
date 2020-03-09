import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PostComment } from "../entities/PostComment";
import { PostCommentRepository } from "../repositories/PostCommentRepository";

@Service()
export class PostCommentService {
    constructor(@InjectRepository() private postCommentRepository: PostCommentRepository) {}

    public async createPostComment(postId: string, text: string, userId: string): Promise<PostComment> {
        const postComment = new PostComment();
        postComment.postId = postId;
        postComment.text = text;
        postComment.userId = userId;

        return await this.postCommentRepository.save(postComment);
    }

    public async getCommentByPostId(postId: string): Promise<PostComment[]> {
        return this.postCommentRepository.find({
            where: { postId: postId },
        });
    }
}
