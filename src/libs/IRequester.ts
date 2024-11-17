import {SystemRole} from "../modules/user/entity/user";
import {UserSystemRole} from "@prisma/client";

export const RequesterKey = "requester"

export interface IRequester {
    requestId: string;
    userId: number;
    systemRole :  UserSystemRole |null;
}