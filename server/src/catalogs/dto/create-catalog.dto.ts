import { IsString } from "class-validator";

export class CreateCatalogDto {
    @IsString()
    name: string;
}