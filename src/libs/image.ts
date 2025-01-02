import Joi from "joi";

export type Image =  {
    id : string;
    width? : number;
    height? : number;
    url: string;
    extension : string;
    cloud?: string;
}


export const imageSchema = Joi.object({
    id: Joi.string().required(),
    width: Joi.number().integer(),
    height: Joi.number().integer(),
    url: Joi.string().uri().required(),
    extension: Joi.string().valid("jpg", "png", "webp", "jpeg").required(),
    cloud: Joi.string().allow(""),
});