import {ICondition} from "../../../../libs/condition";
import {ResultAsync} from "neverthrow";
import {StockInDetailTable} from "../entity/stockInDetailTable";
import {Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {StockInTable} from "../entity/stockInTable";
import {InventoryReportCreate} from "../../../inventory/entity/inventoryReport";
import {StockInCreate} from "../entity/stockIn";
import {IRequester} from "../../../../libs/IRequester";

export interface IStockInService {
    findById(reportId: number): ResultAsync<StockInDetailTable | null, Err>
    list(condition: ICondition, paging: Paging): ResultAsync<StockInTable[] | null, Err>
    create(requester: IRequester, report: StockInCreate): ResultAsync<number | null, Err>

}

