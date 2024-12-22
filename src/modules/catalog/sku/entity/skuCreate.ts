import {Image, imageSchema} from "../../../../libs/image";
import Joi from "joi";

export interface SkuCreate {
    id?: number;
    spuId: number;
    skuTierIdx?: number[];
    images?: Image;
    costPrice: number;
    price: number;
    stock: number;
}

export const skuCreateSchema = Joi.object({
    spuId: Joi.number().required(),
    skuTierIdx: Joi.array().items(Joi.number()),
    images: Joi.array().items(imageSchema),
    costPrice: Joi.number().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
})