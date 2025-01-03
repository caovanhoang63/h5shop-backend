import { InventoryReportCreate, inventoryReportCreateSchema, InventoryReport } from "../entity/inventoryReport";
import {createEntityNotFoundError, createInternalError, Err} from "../../../libs/errors";
import { Paging } from "../../../libs/paging";
import { Validator } from "../../../libs/validator";
import { err, ok, ResultAsync } from "neverthrow";
import { IInventoryReportRepository } from "../repository/IInventoryReportRepository";
import { IInventoryReportService } from "./IInventoryReportService";
import { ICondition } from "../../../libs/condition";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";
import { InventoryReportDetailTable } from "../entity/inventoryReportDetailTable";
import {InventoryReportTable} from "../entity/inventoryReportTable";
import {createMessage, IPubSub} from "../../../components/pubsub";
import {topicCreateInventory} from "../../../libs/topics";
import {IRequester} from "../../../libs/IRequester";

@injectable()
export class InventoryReportService implements IInventoryReportService {
    constructor(@inject(TYPES.IInventoryReportRepository) private readonly inventoryReportRepository: IInventoryReportRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,) {}

    public createReport = (requester: IRequester,report: InventoryReportCreate): ResultAsync<number, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(inventoryReportCreateSchema, report))
                if (vR.isErr()) {
                    return err(vR.error);
                }
                const r = await this.inventoryReportRepository.create(report);
                if (r.isErr()) {
                    return err(r.error);
                }
                this.pubSub.Publish(topicCreateInventory,createMessage(report,requester))
                return ok(r.value);
            })(), e => e as Err
        ).andThen(r => r)
    }

    public findById = (reportId: number): ResultAsync<InventoryReportDetailTable | null, Err> => {
        return this.inventoryReportRepository.findById(reportId);
    }

    public list = (condition: ICondition, paging: Paging): ResultAsync<InventoryReportTable[] | null, Err> => {
        return ResultAsync.fromPromise(
            (async () =>{
                const result = await this.inventoryReportRepository.list(condition, paging);
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}

