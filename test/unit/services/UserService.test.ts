import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserService } from "../../../src/services/UserService";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { PostRepository } from "../../../src/repositories/PostRepository";
import { PostCommentRepository } from "../../../src/repositories/PostCommentRepository";
import { User } from "../../../src/entities/User";
import { CreateUserDto, UpdateUserDto } from "../../../src/dtos/UserDto";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { PostSeed } from "../../utils/seeds/PostTestSeed";
import { PostCommentSeed } from "../../utils/seeds/PostCommentTestSeed";

describe("UserService", () => {
  let db: Connection;
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let postCommentRepository: PostCommentRepository;
  let userService: UserService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    userRepository = db.getCustomRepository(UserRepository);
    await userRepository.save(UserSeed);
    postRepository = db.getCustomRepository(PostRepository);
    await postRepository.save(PostSeed);
    postCommentRepository = db.getCustomRepository(PostCommentRepository);
    await postCommentRepository.save(PostCommentSeed);
    userService = new UserService(
      userRepository,
      postRepository,
      postCommentRepository,
    );
  });

  afterAll(() => db.close());

  const request = {
    realName: "홍길동",
    email: "user@gmail.com",
    password: "password",
  };

  const createUserDto = new CreateUserDto();
  createUserDto.realName = request.realName;
  createUserDto.email = request.email;
  createUserDto.password = request.password;

  const activeUserId: string = "6d2deecf-a0f7-470f-b31f-ede0024efece";
  const wrongUserEmail: string = "null@gmail.com";
  const wrongUserId: string = "notUserId";
  let newUserId: string;

  const updateUserDto = new UpdateUserDto();
  updateUserDto.realName = "김길동";

  it("유저를 생성하고 생성된 정보를 반환한다", async () => {
    const newUser = await userService.createUser(createUserDto);
    newUserId = newUser.id;
    expect(newUser.realName).toBe(request.realName);
    expect(newUser.email).toBe(request.email);
  });

  it("Id가 일치하는 유저를 찾아서 유저 정보를 반환한다", async () => {
    const user = await userService.getUserById(newUserId);
    expect(user).toBeInstanceOf(User);
    expect(user.realName).toBe(request.realName);
    expect(user.email).toBe(request.email);
  });

  it("Id가 일치하는 Post가 없어서 빈 배열을 반환한다", async () => {
    const posts = await userService.getPostsByUserId(newUserId);
    expect(posts).toStrictEqual([]);
  });

  it("Id가 일치하는 Post를 찾아서 Post 배열을 반환한다", async () => {
    const posts = await userService.getPostsByUserId(activeUserId);
    expect(posts.length).toBe(2);
    expect(posts[0].title).toBe("테스트 제목입니다.");
    expect(posts[1].title).toBe("테스트 제목2입니다.");
  });

  it("Id가 일치하는 댓글이 없어서 빈 배열을 반환한다", async () => {
    const comments = await userService.getCommentsByUserId(newUserId);
    expect(comments).toStrictEqual([]);
  });

  it("Id가 일치하는 댓글을 찾아서 댓글 배열을 반환한다", async () => {
    const comments = await userService.getCommentsByUserId(activeUserId);
    expect(comments.length).toBe(2);
    expect(comments[0].text).toBe("테스트 댓글입니다.");
    expect(comments[1].text).toBe("테스트 댓글2입니다.");
  });

  it("이미 등록된 이메일의 중복 여부를 검사하면 true를 반환한다", async () => {
    const isDuplicateUser = await userService.isDuplicateUser(request.email);
    expect(isDuplicateUser).toBeTruthy();
  });

  it("등록되지 않은 이메일의 중복 여부를 검사하면 false를 반환한다", async () => {
    const isUnDuplicateUser = await userService.isDuplicateUser(wrongUserEmail);
    expect(isUnDuplicateUser).toBeFalsy();
  });

  it("유저 정보를 수정하고 수정된 정보를 반환한다", async () => {
    const user = await userService.updateUser(
      newUserId,
      newUserId,
      updateUserDto,
    );
    expect(user.id).toBe(newUserId);
    expect(user.realName).toBe(updateUserDto.realName);
  });

  it("잘못된 유저 정보를 수정하면 실패한다", async () => {
    const result = await userService.updateUser(
      wrongUserId,
      wrongUserId,
      updateUserDto,
    );
    expect(result).toBeNull();
  });

  it("권한이 없는 사람이 유저 정보를 수정하면 실패한다", async () => {
    const result = await userService.updateUser(
      activeUserId,
      newUserId,
      updateUserDto,
    );
    expect(result).toBeNull();
  });
});
