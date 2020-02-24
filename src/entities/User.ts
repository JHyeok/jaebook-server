import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { IsNotEmpty } from "class-validator";
import * as bcrypt from "bcrypt";

@Entity()
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
    @Column()
    public password: string;

    @Column({ name: "refresh_token", nullable: true })
    public refreshToekn: string;

    @CreateDateColumn({ name: "created_at" })
    public createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    public updatedAt: Date;

    @BeforeInsert()
    public async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    public async comparePassword(unencryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(unencryptedPassword, this.password);
    }
}
