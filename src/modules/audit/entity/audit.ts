
export interface Audit {
    id?: bigint,
    userId: number,
    user?: AuditUser,
    action: string,
    objectType: string,
    objectId: number,
    oldValues: any,
    newValues: any,
    userAgent: string | null,
    ipAddress: string | null,
    createdAt: Date,
}

export interface AuditUser {
    firstName: string,
    lastName: string,
}

