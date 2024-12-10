import { BaseModel } from "../../../libs/baseModel";
import Joi from "joi";

export interface InventoryReportDetail extends BaseModel {
    inventoryReportId: number;
    skuId: number;
    amount: number;
    inventoryDif: number;
    isTrue: boolean;
    status: number;
}

export interface InventoryReportDetailCreate extends Omit<InventoryReportDetail, 'id' | 'createdAt'> {}

export const inventoryReportDetailCreateSchema = Joi.object({
    inventoryReportId: Joi.number().required(),
    skuId: Joi.number().required(),
    amount: Joi.number().required(),
    inventoryDif: Joi.number().required(),
    isTrue: Joi.boolean().required(),
    status: Joi.number().valid(0, 1).required()
});

