import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateImagesDto {
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    deletedImagesId?: number[];

    @IsOptional()
    // @IsNumber()
    newMainImageId?: number;
}