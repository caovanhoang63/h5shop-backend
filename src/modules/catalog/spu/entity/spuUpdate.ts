import {image} from "../../../../libs/image";
import Joi from "joi";

export interface SpuUpdate {
    name: string;
    description: string;
    metadata: any,
    categoryId : number,
    image? : image[],
    outOfStock : boolean,
}

export const spuUpdateSchema = Joi.object().keys({
    name : Joi.string().max(255).required(),
    description : Joi.string(),
    categoryId : Joi.number(),
})