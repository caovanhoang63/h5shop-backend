import {BaseModel} from "../../../libs/baseModel";
import {CustomerGender} from "./customer";
import Joi from "joi";

export interface CustomerUpdate extends BaseModel {
    address?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth? : Date;
    gender: CustomerGender;
    discountPoint?: number;
}

export const customerUpdateSchema = Joi.object({
    address: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    dateOfBirth: Joi.date().valid(...Object.values(Date)),
    gender: Joi.string().valid(...Object.values(CustomerGender)),
    discountPoint: Joi.number().optional(),
})