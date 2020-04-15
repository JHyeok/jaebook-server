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
  public id: string;

  @Column({ name: "user_id", length: 36 })
  public userId: string;

  @ManyToOne((type) => User, (user) => user.id, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  public user: User;

  @IsNotEmpty()
  @Column()
  public title: string;

  @IsNotEmpty()
  @Column({ type: "text" })
  public content: string;

  @Column({ name: "preview_content", length: 100 })
  public previewContent: string;

  @Column({ default: 0 })
  public view: number;

  @Column({ default: 0 })
  public like: number;

  @Column({ default: 0, comment: "Best Post에 기준이 되는 점수" })
  public score: number;

  @OneToMany((type) => PostComment, (postComment) => postComment.post)
  public comments: PostComment[];

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;

  @BeforeUpdate()
  public async calculateScoreUsingViewAndLike() {
    this.score = Number(this.view) + Number(this.like) * 500;
  }
}
