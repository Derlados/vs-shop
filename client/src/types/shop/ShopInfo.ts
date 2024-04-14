import { IContact } from "./IContact";
import { IBanner } from "./ILargeBanner";

export interface ShopInfo {
    banners: IBanner[];
    smallBanner: string;
    contacts: IContact[];
}