import {BaseModel} from "../../../libs/baseModel";

export interface AuthCreate extends BaseModel{
    userId : number;
    userName: string;
    salt : string;
    password: string;
}