import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { ShopInfo } from "../model/shop-info.model";

export class EditContactsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ShopInfo.Contact)
    contacts: ShopInfo.Contact[];
}
