import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface StockOutDetail extends BaseModel
{
    stockOutId: number;
    skuId:number;
    amount:number;
    costPrice:number;
    totalPrice:number;
    status:number;
}

export interface StockOutDetailCreate extends Omit<StockOutDetail, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
}
export const stockOutDetailCreateSchema = Joi.object({
    skuId: Joi.number().optional(),
    amount: Joi.number().optional(),
    costPrice: Joi.number().optional(),
    totalPrice: Joi.number().optional(),
});