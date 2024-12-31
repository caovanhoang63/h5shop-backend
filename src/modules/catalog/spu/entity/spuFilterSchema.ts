import Joi from "joi";
import {baseFilterSchema} from "../../../../libs/BaseFilterSchema";

export const spuFilterSchema = baseFilterSchema.keys(
    {
        categoryId: Joi.number,
        brandId: Joi.number,
    }
)

export interface SpuFilter {
    brandId?: number
    categoryId?: number
}