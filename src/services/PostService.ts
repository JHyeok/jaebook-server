import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "../entities/Post";
import { PostRepository } from "../repositories/PostRepository";
import { CreatePostDto, UpdatePostDto } from "../dtos/PostDto";

@Service()
export class PostService {
  constructor(@InjectRepository() private postRepository: PostRepository) {}

  /**
   * 포스트를 생성한다.
   * @param createPostDto 포스트 생성 DTO
   * @param userId 사용자 Id
   */
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

  /**
   * 포스트 목록을 조회한다.
   * @param offset offset
   * @param limit limit
   * @param sort best는 주간 인기글을 조회하고 best가 아니면 일반 최신글을 조회한다.
   */
  public async getPosts(
    offset: number,
    limit: number,
    sort?: string,
  ): Promise<Post[]> {
    switch (sort) {
      case "best":
        const dateBeforeWeek = this.getDateBeforeWeek();

        return await this.postRepository.getBestPosts(
          offset,
          limit,
          dateBeforeWeek,
        );
      default:
        return await this.postRepository.getPosts(offset, limit);
    }
  }

  /**
   * 포스트 정보를 조회한다.
   * @param postId 포스트 Id
   */
  public async getPostById(postId: string): Promise<Post> {
    return await this.postRepository.getPostById(postId);
  }

  /**
   * 포스트의 조회수를 증가한다.
   * @param post 포스트
   */
  public async incrementPostView(post: Post): Promise<void> {
    post.view = post.view + 1;
    await this.postRepository.save(post);
  }

  /**
   * 포스트를 수정한다.
   * @param postId 포스트 Id
   * @param updatePostDto 포스트 수정 DTO
   * @param userId 사용자 Id
   */
  public async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const postToUpdate = await this.postRepository.getPostById(postId);

    if (postToUpdate.user.id === userId) {
      postToUpdate.title = updatePostDto.title;
      postToUpdate.content = updatePostDto.content;
      postToUpdate.previewContent = updatePostDto.content.substring(0, 100);
      return await this.postRepository.save(postToUpdate);
    } else {
      return null;
    }
  }

  /**
   * 포스트를 삭제한다.
   * @param postId 포스트 Id
   * @param userId 사용자 Id
   */
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

  /**
   * 7일 전의 날짜와 시간을 구한다.
   */
  private getDateBeforeWeek(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 7);

    return date;
  }
}
