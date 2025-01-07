import {baseFilterSchema, IBaseFilter} from "../../../libs/BaseFilterSchema";
import Joi from "joi";

export interface WarrantyFilter extends IBaseFilter {
    lkCustomerPhoneNumber?: string;
    warrantyType?: string;
}

export const warrantyFilterSchema = baseFilterSchema.keys({
    lkCustomerPhoneNumber: Joi.string().allow(""),
    warrantyType: Joi.string().optional(),
});