import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "../entities/Post";
import { PostRepository } from "../repositories/PostRepository";
import { CreatePostDto, UpdatePostDto } from "../dtos/PostDto";

@Service()
export class PostService {
    constructor(@InjectRepository() private postRepository: PostRepository) {}

    public async createPost(
        createPostDto: CreatePostDto,
        userId: string,
    ): Promise<Post> {
        const post = createPostDto.toEntity();
        post.userId = userId;
        post.previewContent = post.content.substring(0, 100);

        const newPost = await this.postRepository.save(post);
        return newPost;
    }

    public getPosts(offset: number, limit: number): Promise<Post[]> {
        return this.postRepository.getPosts(offset, limit);
    }

    public getPostById(postId: string): Promise<Post> {
        return this.postRepository.getPostById(postId);
    }

    /**
     * 포스트의 조회수를 증가한다
     * @param post 포스트
     */
    public async incrementPostView(post: Post): Promise<void> {
        post.view = post.view + 1;
        await this.postRepository.save(post);
    }

    public async updatePost(
        postId: string,
        updatePostDto: UpdatePostDto,
        userId: string,
    ): Promise<Post> {
        const postToUpdate = await this.postRepository.getPostById(postId);

        if (postToUpdate.user.id === userId) {
            postToUpdate.title = updatePostDto.title;
            postToUpdate.content = updatePostDto.content;
            postToUpdate.previewContent = updatePostDto.content.substring(
                0,
                100,
            );
            return await this.postRepository.save(postToUpdate);
        } else {
            return null;
        }
    }

    public async deletePost(postId: string, userId: string): Promise<boolean> {
        const postToDelete = await this.postRepository.getPostById(postId);

        if (postToDelete.user.id === userId) {
            await this.postRepository.delete({ id: postId });
            return true;
        }

        return false;
    }

    /**
     * 포스트가 존재하는지 확인한다
     * @param postId 포스트Id
     * @returns true는 포스트가 존재, false는 포스트가 존재하지 않음
     */
    public async isPostById(postId: string): Promise<boolean> {
        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (post) {
            return true;
        }

        return false;
    }
}
