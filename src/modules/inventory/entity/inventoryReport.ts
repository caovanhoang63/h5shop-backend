import { BaseModel } from "../../../libs/baseModel";
import Joi from "joi";
import {InventoryReportDetailCreate, inventoryReportDetailCreateSchema} from "./inventoryReportDetail";

export interface InventoryReport extends BaseModel {
    warehouseMan1: number;
    warehouseMan2?: number;
    warehouseMan3?: number;
    status: number;
    note?: string
}

export interface InventoryReportCreate extends Omit<InventoryReport, 'createdAt' | 'updatedAt' | 'status'> {
    items: InventoryReportDetailCreate[];
}

export const inventoryReportCreateSchema = Joi.object({
    warehouseMan1: Joi.number().required(),
    warehouseMan2: Joi.number().optional(),
    warehouseMan3: Joi.number().optional(),
    note: Joi.string().max(255).optional().allow(""),
    items: Joi.array().items(inventoryReportDetailCreateSchema).required().min(1),
});

