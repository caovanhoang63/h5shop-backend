import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface OrderItemCreate extends BaseModel {
    orderId: number;
    skuId: number;
    amount: number;
    unitPrice: number;
    description?: string;
}

export const orderItemCreateSchema = Joi.object({
    id: Joi.number().optional(),
    orderId: Joi.number().required(),
    skuId: Joi.number().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().optional(),
    unitPrice: Joi.number().positive().optional(),
})