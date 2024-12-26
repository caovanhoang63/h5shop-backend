import {Image, imageSchema} from "../../../../libs/image";
import Joi from "joi";
import {
    SkuWholesalePriceCreate,
    skuWholesalePriceCreateSchema
} from "../../sku-wholesale-prices/entity/SkuWholesalePriceCreate";

export interface SkuCreate {
    id?: number;
    spuId: number;
    skuTierIdx?: number[];
    images?: Image[];
    costPrice: number;
    price: number;
    stock: number;
    wholesalePrices?: SkuWholesalePriceCreate[];
}

export const skuCreateSchema = Joi.object({
    id: Joi.number().allow(null),
    spuId: Joi.number().required(),
    skuTierIdx: Joi.array().items(Joi.number()),
    images : Joi.array().items(imageSchema),
    costPrice: Joi.number().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    wholesalePrices: Joi.array().items(skuWholesalePriceCreateSchema).allow(null),
})