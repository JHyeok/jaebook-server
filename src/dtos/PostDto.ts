import { IsNotEmpty } from "class-validator";
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
