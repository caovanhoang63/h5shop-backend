import {UserSystemRole} from "@prisma/client";

export const RequesterKey = "requester"

export interface IRequester {
    requestId?: string;
    userId?: number;
    userAgent?: string;
    ipAddress?: string;
    systemRole?: UserSystemRole | null;
}