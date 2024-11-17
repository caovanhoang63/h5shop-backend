import {Audit} from "../entity/audit";
import {ResultAsync} from "neverthrow";
import {Paging} from "../../../libs/paging";
import {Err} from "../../../libs/errors";


export interface IAuditRepository {
    create(u : Audit) : ResultAsync<void, Err>
    list(condition: any, paging : Paging) : ResultAsync<Audit[], Err>
}
