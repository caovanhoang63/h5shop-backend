import Joi from "joi";

export interface IBaseFilter {
        gtCreatedAt?: Date,
        ltCreatedAt?: Date,
        gtUpdatedAt?: Date,
        ltUpdatedAt?: Date,
        status? : number[],
}

export const baseFilterSchema = Joi.object(
    {
        gtCreatedAt: Joi.date(),
        ltCreatedAt: Joi.date(),
        gtUpdatedAt: Joi.date(),
        ltUpdatedAt: Joi.date(),
        status : Joi.array().items(Joi.number()),
    }
)