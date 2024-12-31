import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {SkuCreate} from "../entity/skuCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {Sku} from "../entity/sku";
import {SkuDetail} from "../entity/skuDetail";
import {FilterSkuListDetail, SkuListDetail} from "../entity/skuListDetail";

export interface ISkuRepository extends IBaseRepo {
    upsertMany(records : SkuCreate[]): ResultAsync<SkuCreate[], Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Sku[] | null , Err>
    findById(id : number): ResultAsync<Sku | null, Err>
    delete(id : number): ResultAsync<void, Err>
    searchDetail(cond : ICondition, paging : Paging): ResultAsync<SkuDetail[] | null, Err>
    listDetail(cond: FilterSkuListDetail, paging: Paging): ResultAsync<SkuListDetail[] | null, Err>
    getDetailById(id : number): ResultAsync<SkuListDetail | null, Err>
}