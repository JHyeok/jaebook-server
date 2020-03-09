import { EntityRepository, Repository } from "typeorm";
import { PostComment } from "../entities/PostComment";

@EntityRepository(PostComment)
export class PostCommentRepository extends Repository<PostComment> {}
