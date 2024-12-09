import Joi from "joi";

export interface BrandCreate {
    name : string;
}

export const brandCreateScheme = Joi.object().keys({
    name : Joi.string().max(255).required(),
})