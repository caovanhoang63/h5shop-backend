import {BaseModel} from "../../../libs/baseModel";
import {Nullable} from "../../../libs/nullable";
import {SystemRole} from "../../user/entity/user";
import {Result} from "../../../libs/result";

export interface AuthCreate extends BaseModel{
    userId : number;
    userName: string;
    salt : string;
    password: string;
    firstName: string;
    lastName: string;
    systemRole: SystemRole;
}


export interface Token {
    token: string;
    expiredIn: number;
}

export interface TokenResponse {
    accessToken: Token;
    refreshToken?: Token;
}


export interface AuthLogin {
    userName : string;
    password: string;
}



