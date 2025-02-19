import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";
import {OrderType} from "./order";

export interface OrderCreate extends BaseModel {
    customerId?: number;
    sellerId: number;
    orderType: OrderType;
    description?: string;
}

export const orderCreateSchema = Joi.object({
    customerId: Joi.number().optional(),
    sellerId: Joi.number(),
    orderType: Joi.string().valid(...Object.values(OrderType)).required(),
    description: Joi.string().optional(),
})