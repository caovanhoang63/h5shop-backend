import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";
import {OrderType} from "./order";

export interface OrderUpdate extends BaseModel {
    customerId?: number;
    sellerId?: number;
    orderType?: OrderType;
}

export const orderUpdateSchema = Joi.object({
    customerId: Joi.number(),
    sellerId: Joi.number(),
    orderType: Joi.string().valid(...Object.values(OrderType)),
})