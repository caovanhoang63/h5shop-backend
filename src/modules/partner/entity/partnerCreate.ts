import {BaseModel} from "../../../libs/baseModel";
import Joi from "joi";

export interface PartnerCreate extends BaseModel{
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    status: number;
}
export const partnerCreateScheme = Joi.object().keys({
    name: Joi.string().max(255).required(),
    address: Joi.string().max(255).required(),
    phoneNumber: Joi.string().max(10).required(),
    email: Joi.string().email().required(),
    status: Joi.number()
})
