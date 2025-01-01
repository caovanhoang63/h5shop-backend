import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface StockInDetail extends BaseModel
{
    stockInId: number;
    skuId:number;
    amount:number;
    status:number;
}

export interface StockInDetailCreate extends Omit<StockInDetail, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
}
export const stockInDetailCreateSchema = Joi.object({
    stockInId: Joi.number().required(),
    skuId: Joi.number().required(),
    amount: Joi.number().optional(),
});