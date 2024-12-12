import {Image} from "../../../../libs/image";

export interface Sku {
    id: number;
    spuId: number;
    skuTierIdx?: number[];
    images?: Image,
    costPrice: number;
    price: number;
    stock: number;
    status : number;
    createdAt : Date | null;
    updatedAt: Date | null;
}