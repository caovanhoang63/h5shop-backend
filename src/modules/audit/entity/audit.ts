import {AuditLog} from "@prisma/client";


export interface audit {
    id: bigint,
    userId: number,
    action: string,


}