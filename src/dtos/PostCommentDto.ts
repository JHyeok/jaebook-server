import { IsNotEmpty } from "class-validator";
import { PostComment } from "../entities/PostComment";

export class CreatePostCommentDto {
  @IsNotEmpty()
  public text: string;

  public toEntity(postId: string, userId: string): PostComment {
    const { text } = this;

    const postComment = new PostComment();
    postComment.postId = postId;
    postComment.userId = userId;
    postComment.text = text;

    return postComment;
  }
}

export class UpdatePostCommentDto {
  @IsNotEmpty()
  public text: string;
}

export class CreateCommentReplyDto {
  @IsNotEmpty()
  public text: string;

  public toEntity(
    postId: string,
    userId: string,
    commentId: string,
  ): PostComment {
    const { text } = this;

    const postComment = new PostComment();
    postComment.postId = postId;
    postComment.userId = userId;
    postComment.parent = commentId;
    postComment.depth = 1;
    postComment.text = text;

    return postComment;
  }
}
