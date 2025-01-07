import Joi from "joi";
import {SystemRole} from "../../user/entity/user";

export interface WarrantyFormCreate {
    id?: number; // Primary key
    warrantyType: 'new' | 'fix' | 'part' | 'mf_fix'; // Enum for warranty types
    customerId?: number ; // Foreign key, optional
    customerPhoneNumber: number;
    stockInId?: number; // Foreign key, optional
    skuId: number; // Foreign key, required
    orderId: number; // Foreign key, required
    amount: number; // Default: 0
    returnDate: Date; // ISO string format for timestamp, optional
    note?: string; // Optional text field
    status?: number; // Default: 0
}


export const warrantyCreateSchema = Joi.object().keys({
    warrantyType: Joi.string().valid('new' ,'fix' ,'part' , 'mf_fix').required(),
    customerId: Joi.number().optional(),
    customerPhoneNumber: Joi.string().required(),
    stockInId: Joi.number().optional(),
    skuId: Joi.number().required(),
    orderId: Joi.number().optional(),
    amount: Joi.number().required(),
    returnDate: Joi.date().greater("now").iso().required(),
    note: Joi.string().optional(),
    status: Joi.number().optional()
})
