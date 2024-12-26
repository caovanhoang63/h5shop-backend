import Joi from "joi";
import {Image, imageSchema} from "../../../../libs/image";

export interface CategoryCreate {
    id? : number;
    name : string;
    parentId: number | null;
    image?: Image;
}

export const categoryCreateScheme = Joi.object().keys({
    name : Joi.string().max(255).required(),
    parentId: Joi.number().allow(null),
    image: Joi.object().schema(imageSchema)
})