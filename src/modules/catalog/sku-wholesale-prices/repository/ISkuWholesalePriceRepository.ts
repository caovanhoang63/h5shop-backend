import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {SkuWholesalePriceCreate} from "../entity/SkuWholesalePriceCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {SkuWholesalePriceUpdate} from "../entity/SkuWholesalePriceUpdate";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SkuWholesalePrice} from "../entity/SkuWholesalePrice";

export interface ISkuWholesalePriceRepository extends IBaseRepo {
    delete(id: number): ResultAsync<void, Err>
    list(cond: ICondition, paging: Paging): ResultAsync<SkuWholesalePrice[] | null, Err>
    findById(id: number): ResultAsync<SkuWholesalePrice | null, Err>
    upsertMany(c: SkuWholesalePriceCreate[]): ResultAsync<void, Err>
}