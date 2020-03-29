import {
  JsonController,
  Get,
  Param,
  Post,
  UseBefore,
  Res,
  Delete,
  HttpCode,
} from "routing-controllers";
import { PostLikeService } from "../services/PostLikeService";
import { Post as PostEntity } from "../entities/Post";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/posts")
export class PostLikeController {
  constructor(private postLikeService: PostLikeService) {}

  @HttpCode(200)
  @Get("/:id/like")
  @OpenAPI({
    summary: "Post Like 상태 확인",
    description: `사용자가 PostId에 해당하는 Post에 좋아요를 눌렀는지, 누르지 않았는지를 확인한다.\n
        return { isPostLiked: true } 는 사용자가 Like를 누른 Post이다.\n
        return { isPostLiked: false } 는 사용자가 Like를 누르지 않은 Post이다.`,
    statusCode: "200",
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public async checkLike(@Param("id") id: string, @Res() res: Response) {
    const { userId } = res.locals.jwtPayload;
    const isPostLiked = await this.postLikeService.isPostLike(id, userId);

    return {
      isPostLiked,
    };
  }

  @HttpCode(200)
  @Post("/:id/like")
  @OpenAPI({
    summary: "Post 좋아요",
    description: "사용자가 PostId에 해당하는 Post에 좋아요를 한다.",
    statusCode: "200",
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public like(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<PostEntity> {
    const { userId } = res.locals.jwtPayload;

    return this.postLikeService.likePost(id, userId);
  }

  @HttpCode(200)
  @Delete("/:id/like")
  @OpenAPI({
    summary: "Post 좋아요 취소",
    description: "사용자가 PostId에 해당하는 Post에 좋아요를 취소한다.",
    statusCode: "200",
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public unlike(
    @Param("id") id: string,
    @Res() res: Response,
  ): Promise<PostEntity> {
    const { userId } = res.locals.jwtPayload;

    return this.postLikeService.unlikePost(id, userId);
  }
}
