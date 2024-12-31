import {ICondition} from "../../../../libs/condition";
import {ResultAsync} from "neverthrow";
import {StockInDetailTable} from "../entity/stockInDetailTable";
import {Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {StockInTable} from "../entity/stockInTable";

export interface IStockInService {
    getStockInDetails(reportId: number): ResultAsync<StockInDetailTable | null, Err>
    getStockInTable(condition: ICondition, paging: Paging): ResultAsync<StockInTable[] | null, Err>
}

