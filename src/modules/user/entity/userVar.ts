import {BaseModel} from "../../../libs/baseModel";
import {SystemRole} from "./user";
import {Nullable} from "../../../libs/nullable";

export interface UserCreate extends BaseModel {
    firstName: string;
    lastName: Nullable<string>;
    systemRole: SystemRole;
}
