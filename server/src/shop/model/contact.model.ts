import { IsString } from "class-validator";

export class Contact {
    @IsString()
    name: string;

    @IsString()
    icon: string;

    @IsString()
    url: string;
}