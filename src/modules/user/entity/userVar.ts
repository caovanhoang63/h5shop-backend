import {BaseModel} from "../../../libs/baseModel";
import {SystemRole} from "./user";

export interface UserCreate extends BaseModel {
    firstName: string;
    lastName: string;
    systemRole: SystemRole;
}
