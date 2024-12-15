import {Err} from "../../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {IRequester} from "../../../../libs/IRequester";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SkuWholesalePrice} from "../entity/SkuWholesalePrice";

export interface ISkuWholesalePriceService {
    delete(requester: IRequester, id: number): ResultAsync<void, Err>
    list(cond: ICondition, paging: Paging): ResultAsync<SkuWholesalePrice[] | null, Err>
    findById(id: number): ResultAsync<SkuWholesalePrice | null, Err>
}