import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";
import {inventoryReportDetailCreateSchema} from "../../../inventory/entity/inventoryReportDetail";
import {StockInDetailCreate, stockInDetailCreateSchema} from "./stockInDetail";

export interface StockIn extends BaseModel
{
    providerId: number;
    warehouseMen:number;
    totalPrice:number;
    status:number;
}

export interface StockInCreate extends Omit<StockIn, 'createdAt' | 'updatedAt' | 'status'> {
    items: StockInDetailCreate[];
}
export const stockInCreateSchema = Joi.object({
    providerId: Joi.number().required(),
    warehouseMen: Joi.number().required(),
    totalPrice: Joi.number().required(),
    items: Joi.array().items(stockInDetailCreateSchema).required().min(1),
});