import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface StockIn extends BaseModel
{
    providerId: number;
    warehouseMen:number;
    status:number;
}

export interface StockInCreate extends Omit<StockIn, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
}
export const stockInCreateSchema = Joi.object({
    providerId: Joi.number().required(),
    warehouseMen: Joi.number().optional(),
});