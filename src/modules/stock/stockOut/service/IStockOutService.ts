import {ICondition} from "../../../../libs/condition";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {InventoryReportCreate} from "../../../inventory/entity/inventoryReport";
import {IRequester} from "../../../../libs/IRequester";
import {StockOutCreate} from "../entity/stockOut";
import {StockOutTable} from "../entity/stockOutTable";
import {StockOutDetailTable} from "../entity/stockOutDetailTable";


export interface IStockOutService {
    findById(reportId: number): ResultAsync<StockOutDetailTable | null, Err>
    list(condition: ICondition, paging: Paging): ResultAsync<StockOutTable[] | null, Err>
    create(requester: IRequester, report: StockOutCreate): ResultAsync<number | null, Err>

}

