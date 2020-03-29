import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostLikeRepository } from "../../../src/repositories/PostLikeRepository";
import { PostLikeService } from "../../../src/services/PostLikeService";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { PostSeed } from "../../utils/seeds/PostTestSeed";

describe("PostLikeService", () => {
  let db: Connection;
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let postLikeRepository: PostLikeRepository;
  let postLikeService: PostLikeService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    userRepository = db.getCustomRepository(UserRepository);
    await userRepository.save(UserSeed);
    postRepository = db.getCustomRepository(PostRepository);
    await postRepository.save(PostSeed);
    postLikeRepository = db.getCustomRepository(PostLikeRepository);
    postLikeService = new PostLikeService(postRepository, postLikeRepository);
  });

  afterAll(() => db.close());

  const request = {
    postId: "5d1deecf-a0f7-470f-b31f-ede0024efece",
    userId: "6d2deecf-a0f7-470f-b31f-ede0024efece",
  };

  it("포스트가 좋아요가 눌러졌는지 체크하고 false를 반환한다", async () => {
    const result = await postLikeService.isPostLike(
      request.postId,
      request.userId,
    );
    expect(result).toBeFalsy();
  });

  it("포스트에 좋아요를 누르고 좋아요가 1이 된다", async () => {
    const result = await postLikeService.likePost(
      request.postId,
      request.userId,
    );
    expect(result.like).toBe(1);
  });

  it("포스트에 좋아요를 누르는데 중복되었기 때문에 그대로 좋아요는 1이 된다", async () => {
    const result = await postLikeService.likePost(
      request.postId,
      request.userId,
    );
    expect(result.like).toBe(1);
  });

  it("포스트가 좋아요가 눌러졌는지 체크하고 true를 반환한다", async () => {
    const result = await postLikeService.isPostLike(
      request.postId,
      request.userId,
    );
    expect(result).toBeTruthy();
  });

  it("포스트에 좋아요를 취소하고 좋아요가 0이 된다", async () => {
    const result = await postLikeService.unlikePost(
      request.postId,
      request.userId,
    );
    expect(result.like).toBe(0);
  });

  it("포스트에 좋아요를 취소하는데 중복되었기 때문에 그대로 좋아요는 0이 된다", async () => {
    const result = await postLikeService.unlikePost(
      request.postId,
      request.userId,
    );
    expect(result.like).toBe(0);
  });
});
