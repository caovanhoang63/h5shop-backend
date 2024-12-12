import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {ResultAsync} from "neverthrow";
import {Sku} from "../entity/sku";
import {Err} from "../../../../libs/errors";

export interface ISkuService {
    list(cond: ICondition, paging: Paging): ResultAsync<Sku[] | null, Err>;
}