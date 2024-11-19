import Joi from "joi";
import {Image, imageSchema} from "../../../../libs/image";

export interface categoryCreate {
    id? : number;
    name : string;
    level: number;
    parentId: number | null;
    image?: Image;
}

export const categoryCreateScheme = Joi.object().keys({
    name : Joi.string().max(255).required(),
    level: Joi.number().required(),
    parentId: Joi.number().when('level', {
        is: Joi.number().greater(0), // khi level > 0
        then: Joi.number().required(), // parentId bắt buộc phải có
        otherwise: Joi.number().allow(null) // level = 0 thì parentId có thể null
    }),
    image: Joi.object().schema(imageSchema)
})