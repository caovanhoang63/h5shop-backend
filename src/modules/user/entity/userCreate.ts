import {BaseModel} from "../../../libs/baseModel";
import {SystemRole} from "./user";
import Joi from "joi";

export interface UserCreate extends BaseModel {
    userName: string;
    firstName: string;
    lastName: string;
    systemRole: SystemRole;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
    dateOfBirth: Date | null;
    gender: 'male' | 'female' | 'other';
}

export const userCreateSchema = Joi.object({
    userName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    systemRole: Joi.string().valid(...Object.values(SystemRole)),
    email: Joi.string().email().optional(),
    address: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male','female','other').optional(),
})