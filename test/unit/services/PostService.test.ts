import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostService } from "../../../src/services/PostService";
import { UserSeed } from "../seeds/UserTestSeed";
import { User } from "../../../src/entities/User";
import { Post } from "../../../src/entities/Post";

describe("PostService", () => {
    let db: Connection;
    let userRepository: UserRepository;
    let postRepository: PostRepository;
    let postService: PostService;

    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getRepository(User);
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
    };

    const updateRequest = {
        title: "업데이트 제목 입니다.",
        content: "업데이트 내용 입니다.",
    };

    let newPostId: string;

    it("포스트를 생성한다", async () => {
        const newPost = await postService.createPost(request as any);
        newPostId = newPost.id;
        expect(newPost.title).toBe(request.title);
        expect(newPost.content).toBe(request.content);
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
        const post = await postService.updatePost(newPostId, updateRequest, request.user.id);
        expect(post).toBeInstanceOf(Post);
        expect(post.title).toBe(updateRequest.title);
        expect(post.content).toBe(updateRequest.content);
    });
});
