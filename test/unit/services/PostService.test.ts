import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostService } from "../../../src/services/PostService";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { Post } from "../../../src/entities/Post";
import { CreatePostDto, UpdatePostDto } from "../../../src/dtos/PostDto";

describe("PostService", () => {
  let db: Connection;
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let postService: PostService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    userRepository = db.getCustomRepository(UserRepository);
    await userRepository.save(UserSeed);
    postRepository = db.getCustomRepository(PostRepository);
    postService = new PostService(postRepository);
  });

  afterAll(() => db.close());

  const request = {
    title: "테스트 제목 입니다.",
    content: "테스트 내용 입니다.",
    previewContent: "테스트 내용 입니다.",
    user: {
      id: "6d2deecf-a0f7-470f-b31f-ede0024efece",
      realName: "홍길동",
      email: "hellojest@gmail.com",
    },
    updateTitle: "업데이트 제목 입니다.",
    updateContent: "업데이트 내용 입니다.",
  };

  const createPostDto = new CreatePostDto();
  createPostDto.title = request.title;
  createPostDto.content = request.content;

  const updatePostDto = new UpdatePostDto();
  updatePostDto.title = request.updateTitle;
  updatePostDto.content = request.updateContent;

  let newPostId: string;

  it("포스트를 생성한다", async () => {
    const newPost = await postService.createPost(
      createPostDto,
      request.user.id,
    );
    newPostId = newPost.id;
    expect(newPost.title).toBe(request.title);
    expect(newPost.content).toBe(request.content);
  });

  it("Id가 일치하는 포스트를 찾아서 true를 반환한다", async () => {
    const result = await postService.isPostById(newPostId);
    expect(result).toBeTruthy();
  });

  it("Id가 일치하는 포스트를 찾지 못해서 false를 반환한다", async () => {
    const result = await postService.isPostById("notPostId");
    expect(result).toBeFalsy();
  });

  it("Id가 일치하는 포스트를 찾아서 포스트 정보를 반환한다", async () => {
    const post = await postService.getPostById(newPostId);
    expect(post).toBeInstanceOf(Post);
    expect(post.title).toBe(request.title);
    expect(post.content).toBe(request.content);
  });

  it("포스트 목록을 반환한다", async () => {
    const posts = await postService.getPosts(0, 20);
    expect(posts[0].title).toBe(request.title);
    expect(posts[0].previewContent).toBe(request.previewContent);
    expect(posts[0].user.realName).toBe(request.user.realName);
    expect(posts[0].user.email).toBe(request.user.email);
  });

  it("포스트를 수정한다", async () => {
    const post = await postService.updatePost(
      newPostId,
      updatePostDto,
      request.user.id,
    );
    expect(post).toBeInstanceOf(Post);
    expect(post.title).toBe(request.updateTitle);
    expect(post.content).toBe(request.updateContent);
  });

  it("권한이 없는 사람이 포스트 수정에 실패한다", async () => {
    const post = await postService.updatePost(
      newPostId,
      updatePostDto,
      "notUserId",
    );
    expect(post).toBeNull();
  });

  it("권한이 없는 사람이 포스트 삭제에 실패한다", async () => {
    const result = await postService.deletePost(newPostId, "notUserId");
    expect(result).toBeFalsy();
  });

  it("권한이 있는 사람이 포스트 삭제에 성공한다", async () => {
    const result = await postService.deletePost(newPostId, request.user.id);
    expect(result).toBeTruthy();
  });
});
