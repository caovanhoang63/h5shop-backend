import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {ResultAsync} from "neverthrow";
import {Sku} from "../entity/sku";
import {Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {SkuDetail} from "../entity/skuDetail";

export interface ISkuService {
    list(cond: ICondition, paging: Paging): ResultAsync<Sku[] | null, Err>;
    delete(requester: IRequester, id: number): ResultAsync<void, Err>
    searchDetail(cond: ICondition, paging: Paging): ResultAsync<SkuDetail[] | null, Err>
}