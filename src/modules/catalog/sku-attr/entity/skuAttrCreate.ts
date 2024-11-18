import Joi from "joi";


export interface SkuAttrCreate {
    id?: number;
    spuId: number;
    name: string;
    description: string;
    dataType: string;
    value: any;
}

export const skuAttrCreateSchema = Joi.object({
    spuId: Joi.number().required(),
    name: Joi.string().max(255).required(),
    description: Joi.string(),
    dataType: Joi.string().valid('text','number','boolean').required(),
    value: Joi.object().required(),
})

