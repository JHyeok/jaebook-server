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
    public id: string;

    @IsNotEmpty()
    @Column({ name: "real_name", length: 50 })
    public realName: string;

    @IsNotEmpty()
    @Column({ length: 100 })
    public email: string;

    @IsNotEmpty()
    @Column({ select: false })
    public password: string;

    @Column({ name: "refresh_token", nullable: true, select: false })
    public refreshToekn: string;

    @CreateDateColumn({ name: "created_at" })
    public createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    public updatedAt: Date;

    @OneToMany(
        type => Post,
        post => post.user,
    )
    public posts: Post[];

    @BeforeInsert()
    public async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    public async comparePassword(unencryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(unencryptedPassword, this.password);
    }
}
