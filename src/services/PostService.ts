import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "../entities/Post";
import { PostRepository } from "../repositories/PostRepository";

@Service()
export class PostService {
    constructor(@InjectRepository() private postRepository: PostRepository) {}

    public createPost(post: Partial<Post>): Promise<Post> {
        const newPost = this.postRepository.save(post);
        return newPost;
    }

    public getPosts(offset: number, limit: number): Promise<Post[]> {
        return this.postRepository.getPosts(offset, limit);
    }

    public getPostById(postId: string): Promise<Post> {
        return this.postRepository.getPostById(postId);
    }

    public async updatePost(postId: string, post: Partial<Post>, userId: string): Promise<Post> {
        const postToUpdate = await this.postRepository.getPostById(postId);

        if (postToUpdate.user.id === userId) {
            postToUpdate.title = post.title;
            postToUpdate.content = post.content;
            postToUpdate.previewContent = post.content.substring(0, 100);
            this.postRepository.save(postToUpdate);
            return postToUpdate;
        } else {
            return null;
        }
    }
}
