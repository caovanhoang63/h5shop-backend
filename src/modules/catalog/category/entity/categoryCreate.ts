import Joi from "joi";

export interface categoryCreate {
    id? : number;
    name : string;
    description : string;
    metadata :any
}

export const categoryCreateScheme = Joi.object().keys({
    name : Joi.string().max(255).required(),
    description : Joi.string(),
})