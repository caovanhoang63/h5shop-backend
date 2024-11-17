export interface Audit {
    id?: bigint,
    userId: number,
    action: string,
    objectType: string,
    objectId: number,
    oldValues: any,
    newValues: any,
    ipAddress: string | null,
    createdAt: Date,
}

