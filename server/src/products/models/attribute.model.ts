import { Exclude } from "class-transformer";
import { Filter } from "src/category/models/filter.model";
import { AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    allValues: Value[];

    @AfterLoad()
    getAllValues() {        
        if (this.values) {
            const uniqueValues =  new Map<string, Value>();
            this.values.sort((a, b) => a.id - b.id)

            for (const value of this.values) {
                if (!uniqueValues.has(value.name)) {
                    uniqueValues.set(value.name, value);
                }
            }
            this.allValues = [...uniqueValues.values()];
        }
    }
}