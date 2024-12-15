import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ISkuWholesalePriceRepository} from "./ISkuWholesalePriceRepository";
import {SkuWholesalePriceCreate} from "../entity/SkuWholesalePriceCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SkuWholesalePrice} from "../entity/SkuWholesalePrice";

export class SkuWholesalePriceMysqlRepo extends BaseMysqlRepo implements ISkuWholesalePriceRepository {
    create(c: SkuWholesalePriceCreate): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }

    update(id: number, c: SkuWholesalePriceCreate): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }

    list(cond: ICondition, paging: Paging): ResultAsync<SkuWholesalePrice[] | null, Err> {
        throw new Error("Method not implemented.");
    }

    findById(id: number): ResultAsync<SkuWholesalePrice | null, Err> {
        throw new Error("Method not implemented.");
    }

    upsertMany(c: SkuWholesalePriceCreate[]): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }
}