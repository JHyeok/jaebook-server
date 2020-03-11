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
        return this.postCommentRepository.getCommentsByPostId(postId);
    }

    public async updatePostComment(
        postId: string,
        commentId: string,
        text: string,
        userId: string,
    ): Promise<PostComment> {
        const postCommentToUpdate = await this.postCommentRepository.getCommentById(postId, commentId);

        if (postCommentToUpdate?.userId === userId) {
            postCommentToUpdate.text = text;
            this.postCommentRepository.save(postCommentToUpdate);
            return postCommentToUpdate;
        }

        return null;
    }

    public async deletePostComment(postId: string, commentId: string, userId: string): Promise<boolean> {
        const postCommentToDelete = await this.postCommentRepository.getCommentById(postId, commentId);

        if (postCommentToDelete?.userId === userId) {
            await this.postCommentRepository.delete({ id: commentId });
            return true;
        }

        return false;
    }
}
