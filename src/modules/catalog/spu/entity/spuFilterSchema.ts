import Joi from "joi";
import {baseFilterSchema} from "../../../../libs/BaseFilterSchema";

export const spuFilterSchema = Joi.object(
    {
        name: Joi.string().allow(""),
        brandId: Joi.number(),
        categoryId: Joi.number(),
        status: Joi.number().valid(0, 1),
    }
)

export interface SpuFilter {
    name?: string,
    brandId?: number,
    categoryId?: number,
    status?: number,
}