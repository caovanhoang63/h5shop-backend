import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";
import {OrderType} from "./order";

export interface OrderUpdate extends BaseModel {
    customerId: number | null;
    sellerId?: number;
    status?: number;
    orderType?: OrderType;
    description?: string;
}

export const orderUpdateSchema = Joi.object({
    customerId: Joi.number().allow(null),
    sellerId: Joi.number(),
    status: Joi.number(),
    orderType: Joi.string().valid(...Object.values(OrderType)),
    description: Joi.string(),
})