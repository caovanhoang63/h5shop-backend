import { BaseModel } from "../../../libs/baseModel";
import Joi, {number} from "joi";

export interface InventoryReportDetail extends BaseModel {
    inventoryReportId: number;
    skuId: number;
    amount: number;
    oldStock: number;
    inventoryDif: number;
    isTrue: boolean;
    status: number;
}

export interface InventoryReportDetailCreate extends Omit<InventoryReportDetail, 'id' | 'createdAt' |'status'|'isTrue'> {
    skuId: number;
    amount: number;
    oldStock:number;
    inventoryDif: number;
}

export const inventoryReportDetailCreateSchema = Joi.object({
    skuId: Joi.number().required(),
    amount: Joi.number().required(),
    oldStock:Joi.number().required(),
    inventoryDif: Joi.number().required(),
});

