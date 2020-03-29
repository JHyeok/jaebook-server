import {
  IsNotEmpty,
  IsPositive,
  IsNumber,
  Max,
  IsString,
  IsOptional,
} from "class-validator";
import { Post } from "../entities/Post";

export class CreatePostDto {
  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  public content: string;

  public toEntity(): Post {
    const { title, content } = this;

    const post = new Post();
    post.title = title;
    post.content = content;

    return post;
  }
}

export class UpdatePostDto {
  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  public content: string;
}

export class PageablePostDto {
  @IsNumber()
  public offset: number;

  @IsNumber()
  @Max(20)
  @IsPositive()
  public limit: number;

  @IsOptional()
  @IsString()
  public sort: string;
}
