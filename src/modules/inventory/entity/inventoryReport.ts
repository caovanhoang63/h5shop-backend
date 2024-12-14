import { BaseModel } from "../../../libs/baseModel";
import Joi from "joi";

export interface InventoryReport extends BaseModel {
    warehouseMan1: number;
    warehouseMan2?: number;
    warehouseMan3?: number;
    status: number;
}

export interface InventoryReportCreate extends Omit<InventoryReport, 'id' | 'createdAt' | 'updatedAt'> {}

export const inventoryReportCreateSchema = Joi.object({
    warehouseMan1: Joi.number().required(),
    warehouseMan2: Joi.number().optional(),
    warehouseMan3: Joi.number().optional(),
    status: Joi.number().valid(0, 1).required()
});

