import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {IStockInRepository} from "./IStockInRepository";
import {ok, ResultAsync} from "neverthrow";
import {StockInDetailCreate} from "../entity/stockInDetail";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {StockInTable} from "../entity/stockInTable";
import {Err} from "../../../../libs/errors";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {RowDataPacket} from "mysql2";
import {InventoryReportTable} from "../../../inventory/entity/inventoryReportTable";

export class StockInRepository extends BaseMysqlRepo implements IStockInRepository {
    /*getStockInDetails(reportId: number): ResultAsync<StockInDetailCreate | null, Err> {
        return null;
    }*/

    getStockInTable(condition: ICondition, paging: Paging): ResultAsync<StockInTable[] | null, Err> {
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(condition,"st");
        const query = `
            SELECT
                st.id,
                st.provider_id AS providerId,
                p.name AS providerName,
                SUM(std.amount) AS totalAmount,
                st.warehouse_men AS warehouseMen,
                st.status,
                st.created_at AS createdAt,
                st.updated_at AS updatedAt
            FROM
                stock_in st
                    JOIN stock_in_detail std ON st.id = std.stock_in_id
                    JOIN sku s ON std.sku_id = s.id
                    JOIN provider p on st.provider_id = p.id
                ${whereClause}
            GROUP BY st.id
                ${pagingClause}
        `;

        const countQuery = `
            SELECT COUNT(DISTINCT st.id) AS total
            FROM stock_in st
                     JOIN stock_in_detail std ON st.id = std.stock_in_id
                ${whereClause}
        `;

        return this.executeQuery(countQuery, whereValues)
            .andThen(([countResult, _]) => {
                const firstRow = (countResult as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok({ total: 0 });
                }
                paging.total = firstRow.total;
                return ok({ total: firstRow.total });
            })
            .andThen(
                (r) => {
                    if (r.total === 0) {
                        return ok([]);
                    } else {
                        return this.executeQuery(query, whereValues)
                            .andThen(([queryResult, _]) => {
                                const data = (queryResult as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as StockInTable);
                                return ok(data);
                            });
                    }
                }
            );
    }
}