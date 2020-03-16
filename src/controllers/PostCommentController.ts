import { PostService } from "../services/PostService";
import { PostCommentService } from "../services/PostCommentService";
import { JsonController, Get, Param, Body, Post, Put, UseBefore, Res, Delete, HttpCode } from "routing-controllers";
import { PostComment } from "../entities/PostComment";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/posts")
export class PostCommentController {
    constructor(private postService: PostService, private postCommentService: PostCommentService) {}

    @HttpCode(201)
    @Post("/:postId/comments")
    @OpenAPI({
        summary: "Post 댓글 작성",
        statusCode: "201",
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

    @HttpCode(200)
    @Get("/:postId/comments")
    @OpenAPI({
        summary: "Post 댓글 조회",
        statusCode: "200",
    })
    public async getAll(@Param("postId") postId: string): Promise<PostComment[]> {
        const isPost = await this.postService.isPostById(postId);

        if (isPost) {
            return this.postCommentService.getCommentByPostId(postId);
        } else {
            return null;
        }
    }

    @HttpCode(200)
    @Put("/:postId/comments/:id")
    @OpenAPI({
        summary: "Post 댓글 수정",
        statusCode: "200",
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

    @HttpCode(200)
    @Delete("/:postId/comments/:id")
    @OpenAPI({
        summary: "Post 댓글 삭제",
        statusCode: "200",
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
