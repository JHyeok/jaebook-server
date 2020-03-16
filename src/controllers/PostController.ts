import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";
import {
    JsonController,
    Get,
    Param,
    Body,
    Post,
    Put,
    UseBefore,
    Res,
    QueryParam,
    Delete,
    HttpCode,
} from "routing-controllers";
import { Post as PostEntity } from "../entities/Post";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/posts")
export class PostController {
    constructor(private userService: UserService, private postService: PostService) {}

    @HttpCode(201)
    @Post()
    @OpenAPI({
        summary: "Post 작성",
        statusCode: "201",
        security: [{ bearerAuth: [] }],
    })
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

    @HttpCode(200)
    @Get("")
    @OpenAPI({
        summary: "Post 목록 조회",
        statusCode: "200",
    })
    public getAll(@QueryParam("offset") offset: number, @QueryParam("limit") limit: number): Promise<PostEntity[]> {
        const posts = this.postService.getPosts(offset, limit);
        return posts;
    }

    @HttpCode(200)
    @Get("/:id")
    @OpenAPI({
        summary: "Post 조회",
        statusCode: "200",
    })
    public async getOne(@Param("id") id: string): Promise<PostEntity> {
        const post = await this.postService.getPostById(id);

        if (post === undefined) {
            return post;
        } else {
            await this.postService.incrementPostView(post);
        }

        return post;
    }

    @HttpCode(200)
    @Put("/:id")
    @OpenAPI({
        summary: "Post 수정",
        statusCode: "200",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(checkAccessToken)
    public update(@Param("id") id: string, @Body() post: PostEntity, @Res() res: Response): Promise<PostEntity> {
        const { userId } = res.locals.jwtPayload;

        return this.postService.updatePost(id, post, userId);
    }

    @HttpCode(200)
    @Delete("/:id")
    @OpenAPI({
        summary: "Post 삭제",
        statusCode: "200",
        security: [{ bearerAuth: [] }],
    })
    @UseBefore(checkAccessToken)
    public async delete(@Param("id") id: string, @Res() res: Response) {
        const { userId } = res.locals.jwtPayload;

        const result = await this.postService.deletePost(id, userId);

        return {
            postId: id,
            isDelete: result,
        };
    }
}
