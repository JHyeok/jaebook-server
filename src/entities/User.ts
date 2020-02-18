import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, IsNull } from "typeorm";
import { IsNotEmpty } from "class-validator";
import * as bcrypt from "bcrypt";
import { isNull } from "util";

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

    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    public static comparePassword(user: User, unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, user.password);
    }
}
