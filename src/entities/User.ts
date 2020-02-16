import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";
import * as bcrypt from "bcrypt";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ name: "real_name" })
    @IsNotEmpty()
    public realName: string;

    @Column()
    @IsNotEmpty()
    public email: string;

    @Column()
    @IsNotEmpty()
    public password: string;

    @Column({ name: "create_at" })
    @CreateDateColumn()
    createdAt: Date;

    @Column({ name: "update_at" })
    @UpdateDateColumn()
    updatedAt: Date;

    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    public static comparePassword(user: User, unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, user.password);
    }
}
