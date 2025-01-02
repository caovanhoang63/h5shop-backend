import {Image} from "../../../../libs/image";
import {SkuWholesalePriceListDetail} from "./skuListDetail";
import Joi from "joi";

export interface SkuGetWholeSale {
    id: number;
    spuId: number;
    costPrice: number;
    price: number;
    stock: number;
    wholesalePrices: SkuWholesalePriceListDetail[];
}

export interface FilterSkuGetWholeSale {
    id: number;
    quantity: number;
}

export const filterSkuGetWholeSaleSchema = Joi.object({
    id: Joi.number().required(),
    quantity: Joi.number().required(),
})

export interface SkuIdAndWholeSalePrice {
    id: number;
    price: number;
    isWholeSale: boolean;
    stock: number;
}
