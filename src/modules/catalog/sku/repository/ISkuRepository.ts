import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {SkuCreate} from "../entity/skuCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {Sku} from "../entity/sku";

export interface ISkuRepository extends IBaseRepo {
    upsertMany(records : SkuCreate[]): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Sku[] | null , Err>
    findById(id : number): ResultAsync<Sku | null, Err>
    delete(id : number): ResultAsync<void, Err>
}