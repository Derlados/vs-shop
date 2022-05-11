import { User } from "src/users/models/user.model";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    name: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}