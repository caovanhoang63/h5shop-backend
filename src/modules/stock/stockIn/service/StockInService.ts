import {inject, injectable} from "inversify";
import {err, ok, ResultAsync} from "neverthrow";
import { ICondition } from "../../../../libs/condition";
import {createEntityNotFoundError, createInternalError, Err} from "../../../../libs/errors";
import { Paging } from "../../../../libs/paging";
import { StockInDetailTable } from "../entity/stockInDetailTable";
import { StockInTable } from "../entity/stockInTable";
import {IStockInService} from "./IStockInService";
import {TYPES} from "../../../../types";
import {IStockInRepository} from "../repository/IStockInRepository";
import {Validator} from "../../../../libs/validator";
import {StockInCreate, stockInCreateSchema} from "../entity/stockIn";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {topicCreateBrand, topicCreateStockIn} from "../../../../libs/topics";
import {IRequester} from "../../../../libs/IRequester";
import {ISkuService} from "../../../catalog/sku/service/ISkuService";
import {ISkuRepository} from "../../../catalog/sku/repository/ISkuRepository";
import {Sku} from "../../../catalog/sku/entity/sku";
import {SkuCreate} from "../../../catalog/sku/entity/skuCreate";

@injectable()
export class StockInService implements IStockInService {
    constructor(@inject(TYPES.IStockInRepository) private readonly stockInRepository: IStockInRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,
                @inject(TYPES.ISkuRepository) private readonly skuRepo : ISkuRepository,
    ) {}

    findById(reportId: number): ResultAsync<StockInDetailTable | null, Err> {
        return ResultAsync.fromPromise(
            (async () =>{
                const result = await this.stockInRepository.findById(reportId);
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
    list(condition: ICondition, paging: Paging): ResultAsync<StockInTable[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () =>{
                const result = await this.stockInRepository.list(condition, paging);
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
    public create = (requester: IRequester, report: StockInCreate): ResultAsync<number | null, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(stockInCreateSchema, report))
                if (vR.isErr()) {
                    return err(vR.error);
                }
                const r = await this.stockInRepository.create(report);
                if (r.isErr()) {
                    return err(r.error);
                }
                this.pubSub.Publish(topicCreateStockIn,createMessage(report,requester))
                return ok(r.value);
            })(), e => e as Err
        ).andThen(r => r)
    }
}