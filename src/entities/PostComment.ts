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

  @Column({ nullable: true, comment: "부모 댓글 uuid" })
  parent: string;

  @Column({ default: 0, comment: "0: 댓글, 1: 대댓글" })
  depth: number;

  @IsNotEmpty()
  @Column({ type: "text" })
  text: string;

  @Column({
    name: "is_replies",
    default: false,
    comment: "true: 자식 댓글이 있다, false: 자식 댓글이 없다",
  })
  isReplies: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
