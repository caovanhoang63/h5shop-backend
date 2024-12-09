export interface Audit {
    id?: bigint,
    userId: number,
    action: string,
    objectType: string,
    objectId: number,
    oldValues: any,
    newValues: any,
    userAgent: string | null,
    ipAddress: string | null,
    createdAt: Date,
}

