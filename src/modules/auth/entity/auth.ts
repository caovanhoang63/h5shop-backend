import {BaseModel} from "../../../libs/baseModel";

export interface Auth extends BaseModel{
    id : number;
    userId : number;
    userName: string;
    salt : string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}