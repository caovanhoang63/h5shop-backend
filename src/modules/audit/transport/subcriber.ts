import {IAuditService} from "../service/IAuditService";
import {SubHandler} from "../../../components/subcriber";
import {ResultAsync} from "neverthrow";
import {Audit} from "../entity/audit";
import {IRequester} from "../../../libs/IRequester";
import {Err} from "../../../libs/errors";

export class AuditSubscribeHandler {
    constructor(private readonly auditService: IAuditService) {
    }

    onRegister(): SubHandler {
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
                        objectType: "auth",
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



