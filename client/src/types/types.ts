export interface ICkeckValue {
    value: string;
    checked: boolean;
}

export interface IAttribute {
    name: string;
    values: ICkeckValue[];
}

export interface IProduct {
    isNew: boolean;
    img: string;
    title: string;
    price: string;
    oldPrice: string;
}

