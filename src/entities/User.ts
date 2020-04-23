import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import bcrypt from "bcrypt";
import { Post } from "./Post";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  @Column({ name: "real_name", length: 50 })
  realName: string;

  @IsNotEmpty()
  @Column({ length: 100 })
  email: string;

  @IsNotEmpty()
  @Column({ select: false })
  password: string;

  @Column({ name: "refresh_token", nullable: true, select: false })
  refreshToekn: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany((type) => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(unencryptedPassword: string): Promise<boolean> {
    return await bcrypt.compare(unencryptedPassword, this.password);
  }
}
