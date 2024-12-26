import {IRequester} from "../../../../libs/IRequester";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SkuAttrCreate} from "../entity/skuAttrCreate";
import {SkuAttrUpdate} from "../entity/skuAttrUdate";
import {SkuAttr} from "../entity/skuAttr";

export interface ISkuAttrService  {
    create(requester : IRequester,c : SkuAttrCreate): ResultAsync<void, Err>
    createBulk(requester : IRequester, spuId : number, c : SkuAttrCreate[]): ResultAsync<void, Err>
    update(requester : IRequester,id : number,c : SkuAttrUpdate): ResultAsync<void, Err>
    delete(requester : IRequester,id : number, index: number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<SkuAttr[] | null , Err>
    findById(id : number): ResultAsync<SkuAttr | null, Err>
    upsertMany(requester : IRequester, spuId: number, records : SkuAttrCreate[]): ResultAsync<void, Err>
}