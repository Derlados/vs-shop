import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { Contact } from "../model/contact.model";

export class EditContactsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Contact)
    contacts: Contact[];
}
