import { EntityRepository, Repository } from "typeorm";
import { PostLike } from "../entities/PostLike";

@EntityRepository(PostLike)
export class PostLikeRepository extends Repository<PostLike> {}
