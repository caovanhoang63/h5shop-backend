import Joi from "joi";
import {Image, imageSchema} from "../../../../libs/image";

export interface categoryUpdate {
    id? : number;
    name? : string;
    level?: number;
    parentId?: number | null;
    image?: Image;
}

export const categoryUpdateScheme = Joi.object().keys({
    name : Joi.string().max(255),
    level: Joi.number(),
    parentId: Joi.number().when('level', {
        is: Joi.number().greater(0),
        then: Joi.number().required(),
        otherwise: Joi.number().allow(null)
    }),
    image: Joi.object().schema(imageSchema)
})