import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Value } from "./value.model";

@Entity()
export class Attribute {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    attribute: string;

    @OneToMany(() => Value, value => value.attribute)
    values: string[];
}