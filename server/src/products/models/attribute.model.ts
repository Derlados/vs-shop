import { Exclude } from "class-transformer";
import { Filter } from "src/category/models/filter.model";
import { AfterLoad, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Value } from "./value.model";

@Entity()
export class Attribute {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name: string;

    @OneToMany(() => Value, value => value.attribute)
    @Exclude()
    values: Value[];

    @OneToMany(() => Filter, filter => filter.attribute)
    @Exclude()
    filters: Filter[];

    allValues: string[] = [];

    @AfterLoad()
    getAllValues() {
        if (this.values) {
            this.allValues = [...new Set(this.values.map(v => v.value))];
        }
    }
}