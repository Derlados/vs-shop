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

/**
 * EAV
 */
export interface IProduct {
    id: number;
    isNew: boolean;
    imgs: string[];
    title: string;
    price: number;
    oldPrice: number;
    discountPercent: number;
    count: number;
}

export interface IFilters {
    priceRange: IRange;
    attributes: IAttribute[];
}