import { IsNotEmpty } from "class-validator";
import { PostComment } from "../entities/PostComment";

export class CreatePostCommentDto {
  @IsNotEmpty()
  public text: string;

  public toEntity(): PostComment {
    const { text } = this;

    const postComment = new PostComment();
    postComment.text = text;

    return postComment;
  }
}

export class UpdatePostCommentDto {
  @IsNotEmpty()
  public text: string;
}
