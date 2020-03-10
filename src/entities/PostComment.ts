import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { User } from "./User";
import { Post } from "./Post";

@Entity({ name: "post_comment" })
export class PostComment {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ name: "post_id", length: 36 })
    public postId: string;

    @Column({ name: "user_id", length: 36 })
    public userId: string;

    @ManyToOne(
        type => Post,
        post => post.id,
        { cascade: true, onDelete: "CASCADE" },
    )
    @JoinColumn({ name: "post_id" })
    public post: Post;

    @ManyToOne(
        type => User,
        user => user.id,
        { cascade: true, onDelete: "CASCADE" },
    )
    @JoinColumn({ name: "user_id" })
    public user: User;

    @IsNotEmpty()
    @Column({ name: "text" })
    public text: string;

    @CreateDateColumn({ name: "created_at" })
    public createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    public updatedAt: Date;
}
