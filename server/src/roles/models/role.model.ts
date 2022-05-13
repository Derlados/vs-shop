import { User } from "src/users/models/user.model";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, nullable: false, unique: true })
    name: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}