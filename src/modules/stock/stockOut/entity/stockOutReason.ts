import {BaseModel} from "../../../../libs/baseModel";
import Joi from "joi";

export interface StockOutReason extends BaseModel
{
    name: string;
    description:string;
    status:number;
}

export interface StockOutReasonsCreate extends Omit<StockOutReason, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
}
export const stockOutReasonCreateSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
});