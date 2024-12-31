import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {StockInDetailCreate} from "../entity/stockInDetail";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {StockInTable} from "../entity/stockInTable";
import {StockInDetailTable} from "../entity/stockInDetailTable";


export interface IStockInRepository extends IBaseRepo {
    getStockInDetails: (reportId: number) => ResultAsync<StockInDetailTable | null, Err>
    getStockInTable: (condition: ICondition, paging: Paging) => ResultAsync<StockInTable[] | null, Err>
}

