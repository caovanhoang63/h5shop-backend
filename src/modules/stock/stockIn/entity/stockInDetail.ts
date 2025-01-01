import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface StockInDetail extends BaseModel
{
    stockInId: number;
    skuId:number;
    amount:number;
    totalPrice:number;
    status:number;
}

export interface StockInDetailCreate extends Omit<StockInDetail, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
}
export const stockInDetailCreateSchema = Joi.object({
    skuId: Joi.number().required(),
    amount: Joi.number().optional(),
    totalPrice: Joi.number().optional(),
});