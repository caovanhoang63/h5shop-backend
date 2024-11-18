import {IAuditService} from "../../audit/service/IAuditService";
import {SubHandler} from "../../../components/subcriber";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {IRequester} from "../../../libs/IRequester";
import {Audit} from "../../audit/entity/audit";
import {IUserService} from "../service/IUserService";

export class UserSubscriberHandler {
    constructor( private readonly service: IUserService ) {}
    onHardDelete() : SubHandler {
        return (m ) : ResultAsync<void, Err> => {
            return ResultAsync.fromPromise(
                (async () => {
                    await this.service.hardDeleteById(m.data.data.id)
                })(),
                e => e as Err
            )
        }
    }
}



