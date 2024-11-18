import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {IAuditService} from "./IAuditService";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {IRequester} from "../../../libs/IRequester";
import {Paging} from "../../../libs/paging";
import {Audit} from "../entity/audit";
import {IAuditRepository} from "../repository/IAuditRepository";
import {createForbiddenError, createInternalError, Err} from "../../../libs/errors";
import {SystemRole} from "../../user/entity/user";


@injectable()
export class AuditService implements IAuditService {
    constructor(@inject(TYPES.IAuditRepository) private readonly auditRepo: IAuditRepository) {
    }

    create(u: Audit): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.auditRepo.create(u)
                if (r.isErr()) return errAsync(createInternalError(r.error))
                return okAsync(undefined)
            })(),
            e => e as Err
        ).andThen(r => r)
    }

    list(requester: IRequester, condition: any, paging: Paging): ResultAsync<Audit[], Err> {
        return ResultAsync.fromPromise(
            (async () => {
                if (requester.systemRole != SystemRole.Admin.toString()
                    && requester.systemRole != SystemRole.Owner.toString()) {
                    return errAsync(createForbiddenError())
                }

                const r = await this.auditRepo.list(condition, paging)
                if (r.isErr()) return errAsync(createInternalError(r.error))
                return okAsync(r.value)
            })(),
            e => e as Err
        ).andThen(r => r)
    }

}