import { PostService } from "../services/PostService";
import { PostCommentService } from "../services/PostCommentService";
import {
  JsonController,
  Get,
  Param,
  Body,
  Post,
  Put,
  UseBefore,
  Res,
  Delete,
  HttpCode,
} from "routing-controllers";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { OpenAPI } from "routing-controllers-openapi";
import {
  CreatePostCommentDto,
  UpdatePostCommentDto,
  CreateCommentReplyDto,
} from "../dtos/PostCommentDto";

@JsonController("/posts")
export class PostCommentController {
  constructor(
    private postService: PostService,
    private postCommentService: PostCommentService,
  ) {}

  @HttpCode(201)
  @Post("/:postId/comments")
  @OpenAPI({
    summary: "Post 댓글 작성",
    statusCode: "201",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public async create(
    @Param("postId") postId: string,
    @Body() createPostCommentDto: CreatePostCommentDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.jwtPayload;

    const isPost = await this.postService.isPostById(postId);

    if (isPost) {
      return await this.postCommentService.createPostComment(
        postId,
        createPostCommentDto,
        userId,
      );
    } else {
      return res.status(400).send({ message: "일치하는 Post가 없습니다." });
    }
  }

  @HttpCode(200)
  @Get("/:postId/comments")
  @OpenAPI({
    summary: "Post 댓글 조회",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
    statusCode: "200",
  })
  public async getAll(@Param("postId") postId: string, @Res() res: Response) {
    const isPost = await this.postService.isPostById(postId);

    if (isPost) {
      return this.postCommentService.getCommentByPostId(postId);
    } else {
      return res.status(400).send({ message: "일치하는 Post가 없습니다." });
    }
  }

  @HttpCode(200)
  @Put("/:postId/comments/:id")
  @OpenAPI({
    summary: "Post 댓글 수정",
    statusCode: "200",
    responses: {
      "403": {
        description: "Forbidden",
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public async update(
    @Param("postId") postId: string,
    @Param("id") commentId: string,
    @Body() updatePostCommentDto: UpdatePostCommentDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.jwtPayload;
    const updatedPostComment = await this.postCommentService.updatePostComment(
      postId,
      commentId,
      updatePostCommentDto,
      userId,
    );

    if (!updatedPostComment) {
      return res
        .status(403)
        .send({ message: "댓글을 수정할 권한이 없습니다." });
    }

    return updatedPostComment;
  }

  @HttpCode(200)
  @Delete("/:postId/comments/:id")
  @OpenAPI({
    summary: "Post 댓글 삭제",
    statusCode: "200",
    responses: {
      "403": {
        description: "Forbidden",
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public async delete(
    @Param("postId") postId: string,
    @Param("id") commentId: string,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.jwtPayload;

    const result = await this.postCommentService.deletePostComment(
      postId,
      commentId,
      userId,
    );

    if (!result) {
      return res
        .status(403)
        .send({ message: "댓글을 삭제할 권한이 없습니다." });
    }

    return {
      postId: postId,
      postCommentId: commentId,
      isDelete: result,
    };
  }

  @HttpCode(201)
  @Post("/:postId/comments/:id/replies")
  @OpenAPI({
    summary: "Post 댓글 답글 생성",
    statusCode: "201",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public async createReply(
    @Param("postId") postId: string,
    @Param("id") commentId: string,
    @Body() createCommentReplyDto: CreateCommentReplyDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.jwtPayload;

    const commentReply = await this.postCommentService.createCommentReply(
      postId,
      createCommentReplyDto,
      userId,
      commentId,
    );

    if (commentReply) {
      return commentReply;
    } else {
      return res.status(400).send({ message: "잘못된 요청입니다." });
    }
  }

  @HttpCode(200)
  @Get("/:postId/comments/:id/replies")
  @OpenAPI({
    summary: "Post 댓글 답글 조회",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
    statusCode: "200",
  })
  public async getReply(
    @Param("postId") postId: string,
    @Param("id") commentId: string,
    @Res() res: Response,
  ) {
    const comments = await this.postCommentService.getCommentReplies(
      postId,
      commentId,
    );

    if (comments) {
      return comments;
    } else {
      return res.status(400).send({ message: "잘못된 요청입니다." });
    }
  }
}
