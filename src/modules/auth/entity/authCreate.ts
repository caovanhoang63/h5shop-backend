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
}

export const authCreateSchema = Joi.object().keys({
    password: Joi.string().regex(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")).required()
        .error(new Error("Password is not strong enough")),
    // Minimum eight characters, at least one letter, one number and one special character:
    userName: Joi.string().required().min(4),
    systemRole: Joi.required().valid(...Object.values(SystemRole)),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
})
