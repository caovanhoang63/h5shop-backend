import {Image, imageSchema} from "../../../../libs/image";
import Joi from "joi";

export interface SkuUpdate{
    skuTierIdx?: number[];
    images?: Image[],
    costPrice?: number;
    price?: number;
    stock?: number;
}

export const skuUpdateSchema = Joi.object({
    skuTierIdx: Joi.array().items(Joi.number()),
    images: Joi.array().items(imageSchema),
    costPrice: Joi.number(),
    price: Joi.number(),
    stock: Joi.number(),
})
