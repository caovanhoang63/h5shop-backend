import {BaseModel} from "../../../libs/baseModel";
import {CustomerGender} from "./customer";
import Joi from "joi";

export interface CustomerCreate extends BaseModel {
    phoneNumber: string;
    address?: string;
    firstName: string;
    lastName: string;
    dateOfBirth? : Date;
    gender: CustomerGender;
}

export const customerCreateSchema = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    address: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().valid(...Object.values(Date)),
    gender: Joi.string().valid(...Object.values(CustomerGender)),
})