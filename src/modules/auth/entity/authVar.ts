import {BaseModel} from "../../../libs/baseModel";
import {SystemRole} from "../../user/entity/user";




export interface Token {
    token: string;
    expiredIn: number;
}

export interface TokenResponse {
    accessToken: Token;
    refreshToken?: Token;
}






