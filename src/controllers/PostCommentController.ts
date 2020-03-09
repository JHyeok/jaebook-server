import { PostService } from "../services/PostService";
import { PostCommentService } from "../services/PostCommentService";
import { JsonController, Get, Param, Body, Post, Put, UseBefore, Res, QueryParam, Delete } from "routing-controllers";
import { PostComment } from "../entities/PostComment";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";

@JsonController("/posts")
export class PostCommentController {
    constructor(private postService: PostService, private postCommentService: PostCommentService) {}

    @Get("/:id/comments")
    public async getAll(@Param("id") postId: string): Promise<PostComment[]> {
        const isPost = await this.postService.isPostById(postId);

        if (isPost) {
            return this.postCommentService.getCommentByPostId(postId);
        } else {
            return null;
        }
    }

    @Post("/:id/comments")
    @UseBefore(checkAccessToken)
    public async create(
        @Param("id") postId: string,
        @Body() postComment: PostComment,
        @Res() res: Response,
    ): Promise<PostComment> {
        const { userId } = res.locals.jwtPayload;

        const isPost = await this.postService.isPostById(postId);

        if (isPost) {
            return await this.postCommentService.createPostComment(postId, postComment.text, userId);
        } else {
            return null;
        }
    }
}
