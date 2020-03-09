import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Column,
    Index,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity({ name: "post_like" })
@Index(["postId", "userId"], { unique: true })
export class PostLike {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ name: "post_id", length: 36 })
    postId: string;

    @Column({ name: "user_id", length: 36 })
    userId: string;

    @ManyToOne(
        type => Post,
        post => post.id,
    )
    @JoinColumn({ name: "post_id" })
    public post: Post;

    @ManyToOne(
        type => User,
        user => user.id,
    )
    @JoinColumn({ name: "user_id" })
    public user: User;

    @CreateDateColumn({ name: "created_at" })
    public createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    public updatedAt: Date;
}
