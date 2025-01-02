import Joi from "joi";
export interface Setting {
    id : number;
    name : string;
    value : any;
    description?: string;
    createdAt : Date;
    updatedAt : Date;
    status : number;
}

export interface SettingCreate {
    id?: number;
    name : string;
    value : any;
    description?: string;
}

export const SettingCreateSchema = Joi.object().keys({
    id: Joi.optional(),
    name: Joi.string().uppercase().required(),
    value : Joi.any().required(),
    description : Joi.string().optional(),
})

export interface SettingUpdate {
    name : string;
    value : any;
    description?: string;
}

export const SettingUpdateSchema = Joi.object().keys({
    name: Joi.string().uppercase().optional(),
    value : Joi.any().optional(),
    description : Joi.string().optional(),
})

export interface SettingFilter {
    lkName: string,
}