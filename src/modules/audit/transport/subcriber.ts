import {IAuditService} from "../service/IAuditService";
import {SubHandler} from "../../../components/subcriber";
import {ResultAsync} from "neverthrow";
import {Audit} from "../entity/audit";
import {IRequester} from "../../../libs/IRequester";
import {Err} from "../../../libs/errors";

export class AuditSubscribeHandler {
    constructor(private readonly auditService: IAuditService) {
    }

    onCreate(entity: string) : SubHandler {
        return (m): ResultAsync<void, Err> => {
            return ResultAsync.fromPromise(
                (async () => {
                    const requester: IRequester = m.data.requester
                    const create: Audit = {
                        createdAt: new Date(),
                        oldValues: undefined,
                        action: "CREATE",
                        ipAddress: requester.ipAddress ?? null,
                        newValues: m.data.data,
                        objectId: m.data.data.id,
                        objectType: entity,
                        userId: requester.userId ?? 0,
                        userAgent: requester.userAgent ?? null,
                    }
                    const r = await this.auditService.create(create)
                    if (r.isErr()) {
                        console.log(r.error)
                    }
                })(),
                e => e as Err
            )
        }
    }


    onDelete(entity: string) : SubHandler {
        return (m): ResultAsync<void, Err> => {
            return ResultAsync.fromPromise(
                (async () => {
                    const requester: IRequester = m.data.requester
                    const create: Audit = {
                        createdAt: new Date(),
                        oldValues: undefined,
                        action: "DELTE",
                        ipAddress: requester.ipAddress ?? null,
                        newValues: undefined,
                        objectId: m.data.data.id,
                        objectType: entity,
                        userId: requester.userId ?? 0,
                        userAgent: requester.userAgent ?? null,
                    }
                    const r = await this.auditService.create(create)
                    if (r.isErr()) {
                        console.log(r.error)
                    }
                })(),
                e => e as Err
            )
        }
    }

    onUpdate(entity: string) : SubHandler {
        return (m): ResultAsync<void, Err> => {
            return ResultAsync.fromPromise(
                (async () => {
                    const requester: IRequester = m.data.requester
                    const create: Audit = {
                        createdAt: new Date(),
                        oldValues: m.data.data.old,
                        action: "UPDATE",
                        ipAddress: requester.ipAddress ?? null,
                        newValues: m.data.data.new,
                        objectId: m.data.data.id,
                        objectType: entity,
                        userId: requester.userId ?? 0,
                        userAgent: requester.userAgent ?? null,
                    }
                    const r = await this.auditService.create(create)
                    if (r.isErr()) {
                        console.log(r.error)
                    }
                })(),
                e => e as Err
            )
        }
    }

}



