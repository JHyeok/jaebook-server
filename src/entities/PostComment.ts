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

  @ManyToOne((type) => Post, (post) => post.id, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "post_id" })
  public post: Post;

  @ManyToOne((type) => User, (user) => user.id, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  public user: User;

  @Column({ nullable: true, comment: "부모 댓글 uuid" })
  public parent: string;

  @Column({ default: 0, comment: "0: 댓글, 1: 대댓글" })
  public depth: number;

  @IsNotEmpty()
  @Column({ type: "text" })
  public text: string;

  @Column({
    name: "is_replies",
    default: false,
    comment: "true: 자식 댓글이 있다, false: 자식 댓글이 없다",
  })
  public isReplies: boolean;

  @Column({ name: "is_deleted", default: false })
  public isDeleted: boolean;

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;
}
