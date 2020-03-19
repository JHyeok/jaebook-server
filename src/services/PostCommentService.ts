import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PostComment } from "../entities/PostComment";
import { PostCommentRepository } from "../repositories/PostCommentRepository";
import { CreatePostCommentDto, UpdatePostCommentDto } from "../dtos/PostCommentDto";

@Service()
export class PostCommentService {
    constructor(@InjectRepository() private postCommentRepository: PostCommentRepository) {}

    public async createPostComment(
        postId: string,
        createPostCommentDto: CreatePostCommentDto,
        userId: string,
    ): Promise<PostComment> {
        const postComment = createPostCommentDto.toEntity();
        postComment.postId = postId;
        postComment.userId = userId;

        return await this.postCommentRepository.save(postComment);
    }

    public async getCommentByPostId(postId: string): Promise<PostComment[]> {
        return this.postCommentRepository.getCommentsByPostId(postId);
    }

    public async updatePostComment(
        postId: string,
        commentId: string,
        updatePostCommentDto: UpdatePostCommentDto,
        userId: string,
    ): Promise<PostComment> {
        const postCommentToUpdate = await this.postCommentRepository.getCommentById(postId, commentId);

        if (postCommentToUpdate?.userId === userId) {
            postCommentToUpdate.text = updatePostCommentDto.text;
            return await this.postCommentRepository.save(postCommentToUpdate);
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
