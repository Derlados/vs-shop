import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Value } from "./value.model";

@Entity()
export class Attribute {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: 'text', nullable: false })
    attribute: string;

    @OneToMany(() => Value, value => value.attribute)
    values: string[];
}