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
    width: Joi.number().integer().positive().optional(),
    height: Joi.number().integer().positive().optional(),
    url: Joi.string().uri().required(),
    extension: Joi.string().valid("jpg", "png", "webp").required(),
    cloud: Joi.string().optional(),
});