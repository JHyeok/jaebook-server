import {
  JsonController,
  Get,
  Res,
  HttpCode,
  Param,
  Put,
  Body,
  UseBefore,
} from "routing-controllers";
import { Response } from "express";
import { UserService } from "../services/UserService";
import { OpenAPI } from "routing-controllers-openapi";
import { UpdateUserDto } from "../dtos/UserDto";
import { checkAccessToken } from "../middlewares/AuthMiddleware";

@JsonController("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(200)
  @Get("/:id")
  @OpenAPI({
    summary: "사용자 정보",
    description: "UserId로 사용자 정보를 반환한다",
    statusCode: "200",
    responses: {
      "400": {
        description: "Bad request",
      },
    },
  })
  public async getOne(@Param("id") id: string, @Res() res: Response) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      return res.status(400).send({ message: "일치하는 사용자가 없습니다." });
    }

    return user;
  }

  @HttpCode(200)
  @Get("/:id/posts")
  @OpenAPI({
    summary: "사용자 작성한 Post 목록",
    description: "UserId로 사용자가 작성한 Post들을 반환한다",
    statusCode: "200",
    responses: {
      "204": {
        description: "No Content",
      },
    },
  })
  public async getAllPosts(@Param("id") id: string, @Res() res: Response) {
    const posts = await this.userService.getPostsByUserId(id);

    if (posts.length === 0) {
      return res.status(204).send(posts);
    }

    return posts;
  }

  @HttpCode(200)
  @Get("/:id/comments")
  @OpenAPI({
    summary: "사용자가 작성한 댓글 목록",
    description: "UserId로 사용자가 작성한 댓글들을 반환한다",
    statusCode: "200",
    responses: {
      "204": {
        description: "No Content",
      },
    },
  })
  public async getAllComments(@Param("id") id: string, @Res() res: Response) {
    const comments = await this.userService.getCommentsByUserId(id);

    if (comments.length === 0) {
      return res.status(204).send(comments);
    }

    return comments;
  }

  @HttpCode(200)
  @Put("/:id")
  @OpenAPI({
    summary: "사용자 정보 수정",
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
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.jwtPayload;
    const updatedUser = await this.userService.updateUser(
      userId,
      id,
      updateUserDto,
    );

    if (!updatedUser) {
      return res.status(403).send({ message: "수정할 권한이 없습니다." });
    }

    return updatedUser;
  }
}
