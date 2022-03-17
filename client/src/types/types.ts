export interface IRange {
    min: number;
    max: number;
}

export interface ICkeckValue {
    value: string;
    checked: boolean;
}

export interface IAttribute {
    name: string;
    values: ICkeckValue[];
}

export interface IProduct {
    id: number;
    isNew: boolean;
    img: string;
    title: string;
    price: number;
    oldPrice: number;
    discountPercent: number;
}

export interface IFilters {
    priceRange: IRange;
    attributes: IAttribute[];
}