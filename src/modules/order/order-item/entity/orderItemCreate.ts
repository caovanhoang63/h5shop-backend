import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface OrderItemCreate extends BaseModel {
    orderId: number;
    skuId: number;
    amount: number;
    description?: string;
    discount?: number;
}

export const orderItemCreateSchema = Joi.object({
    orderId: Joi.number().required(),
    skuId: Joi.number().required(),
    amount: Joi.number().required(),
    description: Joi.string().optional(),
    discount: Joi.number().optional(),
})