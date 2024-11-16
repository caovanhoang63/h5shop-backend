import {BaseModel} from "../../../libs/baseModel";
import {SystemRole} from "./user";
import {Nullable} from "../../../libs/nullable";
import Joi from "joi";

export interface UserCreate extends BaseModel {
    userName: string;
    firstName: string;
    lastName: string;
    systemRole: SystemRole;
}

export const userCreateSchema = Joi.object({
    userName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    systemRole: Joi.string().valid(...Object.values(SystemRole)),
})