import Joi from "joi";


export const schema = Joi.object().keys({
    password: Joi.string().required().min(8),
})