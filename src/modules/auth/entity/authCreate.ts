import {BaseModel} from "../../../libs/baseModel";
import {SystemRole} from "../../user/entity/user";
import Joi from "joi";

export interface AuthCreate extends BaseModel {
    id?: number;
    userId: number;
    userName: string;
    salt: string;
    password: string;
    firstName: string;
    lastName: string;
    systemRole: SystemRole;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
    dateOfBirth: Date | null;
    gender: 'male' | 'female' | 'other';
}

export const authCreateSchema = Joi.object().keys({
    password: Joi.string().regex(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")).required()
        .error(new Error("Password is not strong enough")),
    userName: Joi.string().required().min(4),
    systemRole: Joi.required().valid(...Object.values(SystemRole)),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().optional(),
    address: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male','female','other').optional(),
    phoneNumber: Joi.string().optional(),
})
