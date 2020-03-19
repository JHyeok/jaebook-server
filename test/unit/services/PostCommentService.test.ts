import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostCommentRepository } from "../../../src/repositories/PostCommentRepository";
import { PostCommentService } from "../../../src/services/PostCommentService";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { PostSeed } from "../../utils/seeds/PostTestSeed";
import { UpdatePostCommentDto, CreatePostCommentDto } from "../../../src/dtos/PostCommentDto";

describe("PostCommentService", () => {
    let db: Connection;
    let userRepository: UserRepository;
    let postRepository: PostRepository;
    let postCommentRepository: PostCommentRepository;
    let postCommentService: PostCommentService;

    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository);
        await userRepository.save(UserSeed);
        postRepository = db.getCustomRepository(PostRepository);
        await postRepository.save(PostSeed);
        postCommentRepository = db.getCustomRepository(PostCommentRepository);
        postCommentService = new PostCommentService(postCommentRepository);
    });

    afterAll(() => db.close());

    const request = {
        postId: "5d1deecf-a0f7-470f-b31f-ede0024efece",
        text: "테스트 댓글입니다.",
        userId: "6d2deecf-a0f7-470f-b31f-ede0024efece",
        updateText: "테스트 댓글 업데이트 내용입니다.",
    };

    const createPostCommentDto = new CreatePostCommentDto();
    createPostCommentDto.text = request.text;

    const updatePostCommentDto = new UpdatePostCommentDto();
    updatePostCommentDto.text = request.updateText;

    let postCommentId: string;

    it("포스트 댓글을 작성한다", async () => {
        const postComment = await postCommentService.createPostComment(
            request.postId,
            createPostCommentDto,
            request.userId,
        );
        postCommentId = postComment.id;
        expect(postComment.postId).toBe(request.postId);
        expect(postComment.text).toBe(request.text);
        expect(postComment.userId).toBe(request.userId);
    });

    it("포스트Id가 일치하는 포스트 댓글 목록을 반환한다", async () => {
        const postComments = await postCommentService.getCommentByPostId(request.postId);
        expect(postComments[0].text).toBe(request.text);
        expect(postComments[0].user.id).toBe(request.userId);
    });

    it("포스트 댓글을 수정한다", async () => {
        const postComment = await postCommentService.updatePostComment(
            request.postId,
            postCommentId,
            updatePostCommentDto,
            request.userId,
        );
        expect(postComment.postId).toBe(request.postId);
        expect(postComment.text).toBe(request.updateText);
        expect(postComment.userId).toBe(request.userId);
    });

    it("권한이 없는 사람이 포스트 댓글 수정에 실패한다", async () => {
        const postComment = await postCommentService.updatePostComment(
            request.postId,
            postCommentId,
            updatePostCommentDto,
            "notUserId",
        );
        expect(postComment).toBeNull();
    });

    it("권한이 없는 사람이 포스트 댓글 삭제에 실패한다", async () => {
        const result = await postCommentService.deletePostComment(request.postId, postCommentId, "notUserId");
        expect(result).toBeFalsy();
    });

    it("권한이 있는 사람이 포스트 댓글 삭제에 성공한다", async () => {
        const result = await postCommentService.deletePostComment(request.postId, postCommentId, request.userId);
        expect(result).toBeTruthy();
    });
});
