import {Audit} from "../entity/audit";
import {ResultAsync} from "neverthrow";
import {Paging} from "../../../libs/paging";
import {IRequester} from "../../../libs/IRequester";
import {Err} from "../../../libs/errors";


export interface IAuditService {
    create(u : Audit) : ResultAsync<void, Err>
    list(requester : IRequester ,condition: any, paging : Paging) : ResultAsync<Audit[], Err>
}