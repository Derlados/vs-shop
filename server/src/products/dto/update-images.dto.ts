import { IsArray, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateImagesDto {
    @IsOptional()
    @IsArray()
    @IsNumberString({}, { each: true })
    deletedImagesId?: number[];

    @IsOptional()
    @IsNumberString()
    newMainImageId?: number;
}