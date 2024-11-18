import {image} from "../../../../libs/image";
import Joi from "joi";

export interface SpuCreate {
    id?: number;
    name: string;
    description: string;
    categoryId: number,
    metadata: any,
    image? : image[],
}

export const spuCreateSchema = Joi.object().keys({
    name : Joi.string().max(255).required(),
    description : Joi.string(),
    categoryId : Joi.number().required(),
})