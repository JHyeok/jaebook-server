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
  id: string;

  @Column({ name: "post_id", length: 36 })
  postId: string;

  @Column({ name: "user_id", length: 36 })
  userId: string;

  @ManyToOne((type) => Post, (post) => post.id, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "post_id" })
  post: Post;

  @ManyToOne((type) => User, (user) => user.id, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
