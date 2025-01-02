import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";
import {OrderType} from "./order";

export interface OrderCreate extends BaseModel {
    customerId: number | null;
    sellerId: number;
    orderType: OrderType;
    description?: string;
}

export const orderCreateSchema = Joi.object({
    customerId: Joi.number().allow(null).optional(),
    sellerId: Joi.number().required(),
    orderType: Joi.string().valid(...Object.values(OrderType)).required(),
    description: Joi.string().optional(),
})