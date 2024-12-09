import Joi from "joi";
import {Image, imageSchema} from "../../../../libs/image";

export interface CategoryCreate {
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
        is: Joi.number().greater(0),
        then: Joi.number().greater(0).required(),
        otherwise: Joi.number().allow(null) 
    }),
    image: Joi.object().schema(imageSchema)
})