import {baseFilterSchema} from "../../../../libs/BaseFilterSchema";
import Joi from "joi";



export const categoryFilterSchema = baseFilterSchema.keys(
    {
        parentId: Joi.number(),
    }
)
