import Joi from "joi";

export interface AuthLogin {
    userName: string;
    password: string;
}

export const authLoginSchema = Joi.object().keys({
    password: Joi.string().required(),
    userName: Joi.string().required(),
})