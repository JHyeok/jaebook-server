import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { PostController } from "../../../src/controllers/PostController";
import { UserService } from "../../../src/services/UserService";
import { PostService } from "../../../src/services/PostService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { PostSeed } from "../../utils/seeds/PostTestSeed";

describe("PostController", () => {
    let db: Connection;
    let userRepository: UserRepository;
    let userService: UserService;
    let postRepository: PostRepository;
    let postService: PostService;
    let postController: PostController;

    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository);
        userService = new UserService(userRepository);
        postRepository = db.getCustomRepository(PostRepository);
        postService = new PostService(postRepository);
        postController = new PostController(userService, postService);
        await postRepository.save(PostSeed);
    });

    afterAll(() => db.close());

    it("GET /api/posts 를 성공한다", async () => {
        const result = await postController.getAll(0, 20);
        // createdAt Order By 생각해서 toBe 작성해야 한다
        expect(result[1].title).toBe(PostSeed[0].title);
        expect(result[1].previewContent).toBe(PostSeed[0].previewContent);
        expect(result[0].title).toBe(PostSeed[1].title);
        expect(result[0].previewContent).toBe(PostSeed[1].previewContent);
    });

    it("GET /api/posts 가 빈 배열을 반환한다", async () => {
        const result = await postController.getAll(20, 40);
        const emptyPosts = [];
        expect(result).toStrictEqual(emptyPosts);
    });

    it("GET /api/posts/:id 를 성공한다", async () => {
        const result = await postController.getOne("6d2deecf-a0f7-470f-b31f-ede0024efece");
        expect(result.title).toBe(PostSeed[0].title);
        expect(result.content).toBe(PostSeed[0].content);
        expect(result.previewContent).toBe(PostSeed[0].previewContent);
    });

    it("GET /api/posts/:id 가 undefined를 반환한다", async () => {
        const result = await postController.getOne("not id");
        expect(result).toBeUndefined();
    });
});
