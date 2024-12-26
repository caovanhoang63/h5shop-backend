import {Image} from "../../../../libs/image";

export interface SkuDetail{
    id: number;
    name: string;
    spuName: string;
    spuId: number;
    skuTierIdx?: number[];
    images?: Image[],
    costPrice: number;
    price: number;
    stock: number;
    attributes: SkuAttrDetail[]
}

export interface SkuAttrDetail {
    name: string;
    value: string[];
}