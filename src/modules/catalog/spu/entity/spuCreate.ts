import {Image, imageSchema} from "../../../../libs/image";
import Joi from "joi";

export interface SpuCreate {
    id?: number;
    name: string;
    brandId: number;
    description: string;
    categoryId: number,
    metadata: any,
    images? : Image,
}

export const spuCreateSchema = Joi.object().keys({
    name : Joi.string().max(255).required(),
    description : Joi.string(),
    categoryId : Joi.number().required(),
    metadata : Joi.object(),
    image : Joi.array().items(imageSchema)
})