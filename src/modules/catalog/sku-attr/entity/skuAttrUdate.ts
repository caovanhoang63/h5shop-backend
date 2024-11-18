import Joi from "joi";

export interface SkuAttrUpdate{
    spuId?: number;
    name?: string;
    description?: string;
    dataType?: string;
    value?: any;
}

export const skuAttrUpdateSchema = Joi.object({
    spuId: Joi.number(),
    name: Joi.string().max(255),
    description: Joi.string(),
    dataType: Joi.string().valid('text','number','boolean'),
    value: Joi.object(),
})