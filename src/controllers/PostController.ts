import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";
import { JsonController, Get, Param, Body, Post, UseBefore, Res, QueryParam } from "routing-controllers";
import { Post as PostEntity } from "../entities/Post";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";

@JsonController("/posts")
export class PostController {
    constructor(private userService: UserService, private postService: PostService) {}

    @Post()
    @UseBefore(checkAccessToken)
    public async create(@Body() post: PostEntity, @Res() res: Response): Promise<PostEntity> {
        const { userId } = res.locals.jwtPayload;
        const user = await this.userService.getUsersById(userId);
        const { title, content } = post;

        return this.postService.createPost({
            title,
            content,
            previewContent: content.substring(0, 100),
            user: user,
        });
    }

    @Get("")
    public getAll(@QueryParam("offset") offset: number, @QueryParam("limit") limit: number): Promise<PostEntity[]> {
        return this.postService.getPosts(offset, limit);
    }

    @Get("/:id")
    public getOne(@Param("id") id: string): Promise<PostEntity> {
        return this.postService.getPostById(id);
    }
}
