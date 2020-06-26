import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Post } from "../entities/Post";
import { PostLike } from "../entities/PostLike";
import { PostRepository } from "../repositories/PostRepository";
import { PostLikeRepository } from "../repositories/PostLikeRepository";

@Service()
export class PostLikeService {
  constructor(
    @InjectRepository() private postRepository: PostRepository,
    @InjectRepository() private postLikeRepository: PostLikeRepository,
  ) {}

  /**
   * 포스트에 좋아요를 눌렀었는지 확인한다.
   * @param postId 포스트 Id
   * @param userId 사용자 Id
   * @returns true는 좋아요를 한 상태, false는 좋아요를 하지 않은 상태
   */
  public async isPostLike(postId: string, userId: string): Promise<boolean> {
    const postLike = await this.postLikeRepository.findOne({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (postLike) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 포스트에 좋아요를 한다.
   * @param postId 포스트 Id
   * @param userId 사용자 Id
   */
  public async likePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    const alreadyPostLiked = await this.postLikeRepository.findOne({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (alreadyPostLiked) {
      return post;
    }

    const postLike = new PostLike();
    postLike.postId = postId;
    postLike.userId = userId;
    await this.postLikeRepository.save(postLike);

    const postLikeCount = await this.postLikeRepository.count({
      where: {
        postId: postId,
      },
    });

    post.like = postLikeCount;
    await this.postRepository.save(post);

    return post;
  }

  /**
   * 포스트에 좋아요를 취소한다.
   * @param postId 포스트 Id
   * @param userId 사용자 Id
   */
  public async unlikePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    const postLike = await this.postLikeRepository.findOne({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (!postLike) {
      return post;
    }

    await this.postLikeRepository.remove(postLike);

    const postLikeCount = await this.postLikeRepository.count({
      where: {
        postId: postId,
      },
    });

    post.like = postLikeCount;
    await this.postRepository.save(post);

    return post;
  }
}
