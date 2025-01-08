import {inject, injectable} from "inversify";
import {err, ok, ResultAsync} from "neverthrow";
import { ICondition } from "../../../../libs/condition";
import {createEntityNotFoundError, createInternalError, Err} from "../../../../libs/errors";
import { Paging } from "../../../../libs/paging";
import {IStockOutService} from "./IStockOutService";
import {TYPES} from "../../../../types";
import {Validator} from "../../../../libs/validator";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {topicCreateBrand, topicCreateStockIn, topicCreateStockOut} from "../../../../libs/topics";
import {IRequester} from "../../../../libs/IRequester";
import {ISkuRepository} from "../../../catalog/sku/repository/ISkuRepository";
import {IStockOutRepository} from "../repository/IStockOutRepository";
import {StockOutDetailTable} from "../entity/stockOutDetailTable";
import {StockOutTable} from "../entity/stockOutTable";
import {StockOutCreate, stockOutCreateSchema} from "../entity/stockOut";
import { StockOutReason} from "../entity/stockOutReason";

@injectable()
export class StockOutService implements IStockOutService {
    constructor(@inject(TYPES.IStockOutRepository) private readonly stockOutRepository: IStockOutRepository,
                @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
                @inject(TYPES.ISkuRepository) private readonly skuRepo: ISkuRepository,
    ) {
    }

    listReason(condition: ICondition, paging: Paging): ResultAsync<StockOutReason[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () =>{
                const result = await this.stockOutRepository.listReason(condition,paging);
                if (result.isErr()){
                    return err(result.error)
                }
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(reportId: number): ResultAsync<StockOutDetailTable | null, Err> {
        return ResultAsync.fromPromise(
            (async () =>{
                const result = await this.stockOutRepository.findById(reportId);
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
    list(condition: ICondition, paging: Paging): ResultAsync<StockOutTable[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () =>{
                const result = await this.stockOutRepository.list(condition, paging);
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
    public create = (requester: IRequester, report: StockOutCreate): ResultAsync<number | null, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(stockOutCreateSchema, report))
                if (vR.isErr()) {
                    return err(vR.error);
                }
                const r = await this.stockOutRepository.create(report);
                if (r.isErr()) {
                    return err(r.error);
                }
                this.pubSub.Publish(topicCreateStockOut,createMessage(report,requester))
                return ok(r.value);
            })(), e => e as Err
        ).andThen(r => r)
    }
}