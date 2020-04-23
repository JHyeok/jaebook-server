import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeUpdate,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { User } from "./User";
import { PostComment } from "./PostComment";

@Entity({ name: "post" })
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", length: 36 })
  userId: string;

  @ManyToOne((type) => User, (user) => user.id, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @IsNotEmpty()
  @Column()
  title: string;

  @IsNotEmpty()
  @Column({ type: "text" })
  content: string;

  @Column({ name: "preview_content", length: 100 })
  previewContent: string;

  @Column({ default: 0 })
  view: number;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0, comment: "Best Post에 기준이 되는 점수" })
  score: number;

  @OneToMany((type) => PostComment, (postComment) => postComment.post)
  comments: PostComment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @BeforeUpdate()
  async calculateScoreUsingViewAndLike() {
    this.score = Number(this.view) + Number(this.like) * 500;
  }
}
