import { IsString } from "class-validator";

export class CreateLargeBannerDto {
    @IsString()
    title: string;

    @IsString()
    subtitle: string;

    @IsString()
    link: string;
}