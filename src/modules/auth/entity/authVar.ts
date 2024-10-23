import {BaseModel} from "../../../libs/baseModel";
import {Nullable} from "../../../libs/nullable";
import {SystemRole} from "../../user/entity/user";

export interface AuthCreate extends BaseModel{
    userId : number;
    userName: string;
    salt : string;
    password: string;
    firstName: string;
    lastName: string;
    systemRole: SystemRole;
}