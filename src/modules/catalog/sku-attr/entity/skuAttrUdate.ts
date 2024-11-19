import Joi from "joi";

export interface SkuAttrUpdate{
    name?: string;
    description?: string;
    dataType?: string;
    value?: any[];
}

export const skuAttrUpdateSchema = Joi.object({
    name: Joi.string().max(255),
    description: Joi.string(),
    dataType: Joi.string().valid('text','number','boolean'),
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
    })
})