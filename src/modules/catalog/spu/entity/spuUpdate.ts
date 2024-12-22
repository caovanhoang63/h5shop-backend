import {Image} from "../../../../libs/image";
import Joi from "joi";

export interface SpuUpdate {
    name: string;
    description: string;
    metadata: any,
    categoryId : number,
    images? : Image,
    outOfStock : boolean,
}

export const spuUpdateSchema = Joi.object().keys({
    name : Joi.string().max(255).required(),
    description : Joi.string(),
    metadata : Joi.object(),
    categoryId : Joi.number(),
    image: Joi.object(),
    outOfStock : Joi.boolean(),
})