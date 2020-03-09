import { JsonController, Get, Param, Post, UseBefore, Res, Delete } from "routing-controllers";
import { PostLikeService } from "../services/PostLikeService";
import { Post as PostEntity } from "../entities/Post";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";

@JsonController("/posts")
export class PostLikeController {
    constructor(private postLikeService: PostLikeService) {}

    @Get("/:id/like")
    @UseBefore(checkAccessToken)
    public async checkLike(@Param("id") id: string, @Res() res: Response) {
        const { userId } = res.locals.jwtPayload;
        const postLiked = await this.postLikeService.isPostLike(id, userId);

        return {
            isPostLiked: postLiked,
        };
    }

    @Post("/:id/like")
    @UseBefore(checkAccessToken)
    public like(@Param("id") id: string, @Res() res: Response): Promise<PostEntity> {
        const { userId } = res.locals.jwtPayload;

        return this.postLikeService.likePost(id, userId);
    }

    @Delete("/:id/like")
    @UseBefore(checkAccessToken)
    public unlike(@Param("id") id: string, @Res() res: Response): Promise<PostEntity> {
        const { userId } = res.locals.jwtPayload;

        return this.postLikeService.unlikePost(id, userId);
    }
}
