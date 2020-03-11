import { PostService } from "../services/PostService";
import { PostCommentService } from "../services/PostCommentService";
import { JsonController, Get, Param, Body, Post, Put, UseBefore, Res, Delete } from "routing-controllers";
import { PostComment } from "../entities/PostComment";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/posts")
export class PostCommentController {
    constructor(private postService: PostService, private postCommentService: PostCommentService) {}

    @Post("/:postId/comments")
    @OpenAPI({
        description: "Post 댓글 작성",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(checkAccessToken)
    public async create(
        @Param("postId") postId: string,
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

    @Get("/:postId/comments")
    @OpenAPI({
        description: "Post 댓글 조회",
        security: [{ bearerAuth: [] }],
    })
    public async getAll(@Param("postId") postId: string): Promise<PostComment[]> {
        const isPost = await this.postService.isPostById(postId);

        if (isPost) {
            return this.postCommentService.getCommentByPostId(postId);
        } else {
            return null;
        }
    }

    @Put("/:postId/comments/:id")
    @OpenAPI({
        description: "Post 댓글 수정",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(checkAccessToken)
    public update(
        @Param("postId") postId: string,
        @Param("id") commentId: string,
        @Body() postComment: PostComment,
        @Res() res: Response,
    ): Promise<PostComment> {
        const { userId } = res.locals.jwtPayload;

        return this.postCommentService.updatePostComment(postId, commentId, postComment.text, userId);
    }

    @Delete("/:postId/comments/:id")
    @OpenAPI({
        description: "Post 댓글 삭제",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(checkAccessToken)
    public async delete(@Param("postId") postId: string, @Param("id") commentId: string, @Res() res: Response) {
        const { userId } = res.locals.jwtPayload;

        const result = await this.postCommentService.deletePostComment(postId, commentId, userId);

        return {
            postId: postId,
            postCommentId: commentId,
            isDelete: result,
        };
    }
}
