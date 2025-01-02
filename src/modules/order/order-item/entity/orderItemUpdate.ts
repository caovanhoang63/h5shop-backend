import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface OrderItemUpdate extends BaseModel {
    amount?: number;
    description?: string;
    unitPrice?: number;
}

export const orderItemUpdateSchema = Joi.object({
    amount: Joi.number().optional(),
    description: Joi.string().optional(),
    unitPrice: Joi.number().optional(),
})