import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {StockInDetailCreate} from "../entity/stockInDetail";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {StockInTable} from "../entity/stockInTable";


export interface IStockInRepository extends IBaseRepo {
    //getStockInDetails: (reportId: number) => ResultAsync<StockInDetailCreate | null, Err>
    getStockInTable: (condition: ICondition, paging: Paging) => ResultAsync<StockInTable[] | null, Err>
}

