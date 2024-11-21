import {SystemRole} from "../modules/user/entity/user";

export const RequesterKey = "requester"

export interface IRequester {
    requestId?: string;
    userId?: number;
    userAgent?: string;
    ipAddress?: string;
    systemRole?: SystemRole | null;
}