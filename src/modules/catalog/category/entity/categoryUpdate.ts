import Joi from "joi";
import {Image, imageSchema} from "../../../../libs/image";

export interface CategoryUpdate {
    name? : string;
    image?: Image;
}

export const categoryUpdateScheme = Joi.object().keys({
    name : Joi.string().max(255),
    image: Joi.object().schema(imageSchema)
})