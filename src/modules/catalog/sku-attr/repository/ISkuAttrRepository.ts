import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SkuAttrCreate} from "../entity/skuAttrCreate";
import {SkuAttrUpdate} from "../entity/skuAttrUdate";
import {SkuAttr} from "../entity/skuAttr";
import {IRequester} from "../../../../libs/IRequester";

export interface ISkuAttrRepository extends IBaseRepo {
    create(c : SkuAttrCreate): ResultAsync<void, Err>
    addBulk(c : SkuAttrCreate[]): ResultAsync<void, Err>
    update(id : number,c : SkuAttrUpdate): ResultAsync<void, Err>
    delete(id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<SkuAttr[] | null , Err>
    findById(id : number): ResultAsync<SkuAttr | null, Err>
    upsertMany(records : SkuAttrCreate[]): ResultAsync<void, Err>
}