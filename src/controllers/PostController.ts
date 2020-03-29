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
  Delete,
  HttpCode,
  QueryParams,
} from "routing-controllers";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { Response } from "express";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { CreatePostDto, UpdatePostDto, PageablePostDto } from "../dtos/PostDto";

@JsonController("/posts")
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(201)
  @Post()
  @OpenAPI({
    summary: "Post 작성",
    statusCode: "201",
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public async create(
    @Body() createPostDto: CreatePostDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.jwtPayload;
    const newPost = await this.postService.createPost(createPostDto, userId);

    return newPost;
  }

  @HttpCode(200)
  @Get("")
  @OpenAPI({
    summary: "Post 목록 조회",
    statusCode: "200",
    responses: {
      "204": {
        description: "No Content",
      },
    },
  })
  @ResponseSchema(PageablePostDto)
  public async getAll(
    @QueryParams() pageablePostDto: PageablePostDto,
    @Res() res: Response,
  ) {
    const posts = await this.postService.getPosts(
      pageablePostDto.offset,
      pageablePostDto.limit,
      pageablePostDto.sort,
    );

    if (posts.length === 0) {
      return res.status(204).send(posts);
    }

    return posts;
  }

  @HttpCode(200)
  @Get("/:id")
  @OpenAPI({
    summary: "Post 조회",
    statusCode: "200",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
  public async getOne(@Param("id") id: string, @Res() res: Response) {
    const post = await this.postService.getPostById(id);

    if (post) {
      await this.postService.incrementPostView(post);
    } else {
      return res.status(400).send({ message: "일치하는 Post가 없습니다." });
    }

    return post;
  }

  @HttpCode(200)
  @Put("/:id")
  @OpenAPI({
    summary: "Post 수정",
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
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.jwtPayload;
    const updatedPost = await this.postService.updatePost(
      id,
      updatePostDto,
      userId,
    );

    if (!updatedPost) {
      return res
        .status(403)
        .send({ message: "Post를 수정할 권한이 없습니다." });
    }

    return updatedPost;
  }

  @HttpCode(200)
  @Delete("/:id")
  @OpenAPI({
    summary: "Post 삭제",
    statusCode: "200",
    responses: {
      "403": {
        description: "Forbidden",
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkAccessToken)
  public async delete(@Param("id") id: string, @Res() res: Response) {
    const { userId } = res.locals.jwtPayload;

    const result = await this.postService.deletePost(id, userId);

    if (!result) {
      return res
        .status(403)
        .send({ message: "Post를 삭제할 권한이 없습니다." });
    }

    return {
      postId: id,
      isDelete: result,
    };
  }
}
