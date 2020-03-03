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

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    public id: string;

    @ManyToOne(
        type => User,
        user => user.id,
    )
    @JoinColumn({ name: "user_id" })
    public user: User;

    @IsNotEmpty()
    @Column({ name: "title" })
    public title: string;

    @IsNotEmpty()
    @Column({ name: "content" })
    public content: string;

    @Column({ name: "preview_content", length: 100 })
    public previewContent: string;

    @CreateDateColumn({ name: "created_at" })
    public createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    public updatedAt: Date;
}
