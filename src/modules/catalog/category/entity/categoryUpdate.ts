import Joi from "joi";

export interface categoryUpdate {
    name : string;
    description : string;
    images : any;
    metadata :any
}

export const categoryUpdateScheme = Joi.object().keys({
    name : Joi.string().max(255).required(),
    description : Joi.string(),
})