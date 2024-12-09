import Joi from "joi";
import {Image, imageSchema} from "../../../../libs/image";


export interface SkuAttrCreate {
    id?: number;
    spuId: number;
    name: string;
    value: any[];
    images?: Image;
    dataType: string;
}

export const skuAttrCreateSchema = Joi.object({
    spuId: Joi.number().required(),
    name: Joi.string().max(255).required(),
    dataType: Joi.string().valid('text','number','boolean').required(),
    images: Joi.array().items(imageSchema),
    value: Joi.array().when('dataType',{
        is: 'text',
        then: Joi.array().items(Joi.string()).required(),
        otherwise: Joi.when('dataType',{
            is: 'number',
            then: Joi.array().items(Joi.number()).required(),
            otherwise: Joi.when('dataType', {
                is: 'boolean',
                then: Joi.array().items(Joi.boolean()),
                otherwise: Joi.array()
            })
        }),
    }).required(),
})

