import {Audit} from "../entity/audit";
import {ResultAsync} from "neverthrow";
import {Paging} from "../../../libs/paging";
import {Err} from "../../../libs/errors";
import {IBaseRepo} from "../../../libs/IBaseRepo";


export interface IAuditRepository extends IBaseRepo {
    create(u: Audit): ResultAsync<void, Err>

    list(condition: any, paging: Paging): ResultAsync<Audit[], Err>
}
