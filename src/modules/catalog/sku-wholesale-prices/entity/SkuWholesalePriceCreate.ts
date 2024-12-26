import Joi from "joi";

export interface SkuWholesalePriceCreate {
    id?: number;
    skuId: number;
    minQuantity: number;
    price: number;
}

export const skuWholesalePriceCreateSchema = Joi.object({
    id: Joi.number().allow(null),
    skuId: Joi.number().allow(null),
    minQuantity: Joi.number().required(),
    price: Joi.number().required(),
})