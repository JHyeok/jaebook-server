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

    public getAllPosts(): Promise<Post[]> {
        return this.postRepository.getPosts();
        // return this.postRepository.find();
    }

    public getPostById(id: string): Promise<Post> {
        return this.postRepository.findOne({
            where: { id: id },
        });
    }
}
