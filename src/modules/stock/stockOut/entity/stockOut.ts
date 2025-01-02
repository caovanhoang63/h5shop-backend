import {BaseModel} from "../../../../libs/baseModel";
import {StockInDetailCreate, stockInDetailCreateSchema} from "../../stockIn/entity/stockInDetail";
import Joi from "joi";
import {StockOutDetailCreate, stockOutDetailCreateSchema} from "./stockOutDetail";

export interface StockOut extends BaseModel
{
    warehouseMen: number;
    stockOutReasonId:number;
    status:number;
}

export interface StockOutCreate extends Omit<StockOut, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
    items: StockOutDetailCreate[];
}
export const stockOutCreateSchema = Joi.object({
    warehouseMen: Joi.number().required(),
    stockOutReasonId: Joi.number().required(),
    items: Joi.array().items(stockOutDetailCreateSchema).required().min(1),
});