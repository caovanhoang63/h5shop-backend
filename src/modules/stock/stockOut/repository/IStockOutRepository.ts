import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {StockOutDetailTable} from "../entity/stockOutDetailTable";
import {StockOutTable} from "../entity/stockOutTable";
import {StockOutCreate} from "../entity/stockOut";
import { StockOutReason} from "../entity/stockOutReason";

export interface IStockOutRepository extends IBaseRepo {
    findById: (reportId: number) => ResultAsync<StockOutDetailTable | null, Err>
    list: (condition: ICondition, paging: Paging) => ResultAsync<StockOutTable[] | null, Err>
    create: (report: StockOutCreate) => ResultAsync<number| null, Err>
    listReason: (condition: ICondition, paging: Paging) => ResultAsync<StockOutReason[] | null, Err>

}
