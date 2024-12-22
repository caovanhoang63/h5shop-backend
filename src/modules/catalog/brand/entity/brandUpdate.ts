import Joi from "joi";

export interface BrandUpdate {
    name : string;
    status? : number;
}

export const brandUpdateScheme = Joi.object().keys({
    name : Joi.string().max(255).required(),
    status: Joi.number().integer().min(0).max(1).default(1)
})