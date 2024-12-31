import Joi from "joi";
import {Image, imageSchema} from "../../../../libs/image";

export interface CategoryUpdate {
    name? : string;
    parentId?: number | null;
    image?: Image;
}

export const categoryUpdateScheme = Joi.object().keys({
    name : Joi.string().max(255),
    parentId: Joi.number().allow(null),
    image: Joi.object().schema(imageSchema)
})