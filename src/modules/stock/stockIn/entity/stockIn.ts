import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";
import {inventoryReportDetailCreateSchema} from "../../../inventory/entity/inventoryReportDetail";
import {StockInDetailCreate, stockInDetailCreateSchema} from "./stockInDetail";

export interface StockIn extends BaseModel
{
    providerId: number;
    warehouseMen:number;
    status:number;
}

export interface StockInCreate extends Omit<StockIn, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
    items: StockInDetailCreate[];
}
export const stockInCreateSchema = Joi.object({
    providerId: Joi.number().required(),
    warehouseMen: Joi.number().optional(),
    items: Joi.array().items(stockInDetailCreateSchema).required().min(1),
});