import {BaseModel} from "../../../libs/baseModel";
import Joi from "joi";

export interface PartnerUpdate extends BaseModel {
    name?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    status?: number;
}
export const partnerUpdateScheme = Joi.object().keys({
    name: Joi.string().max(255),
    address: Joi.string().max(255),
    phoneNumber: Joi.string().max(10),
    email: Joi.string().email(),
    status: Joi.number()
})