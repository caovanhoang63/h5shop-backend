export interface Audit {
    id: bigint,
    userId: number,
    action: string,
    objectType: string,
    objectId: number,
    oldValues: any | null,
    newValues: any |null,
    ipAddress: string | null,
    createdAt: Date,
}