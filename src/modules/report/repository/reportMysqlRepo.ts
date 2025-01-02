import {ok, okAsync, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {Revenue} from "../entity/revenue";
import {IReportRepo} from "./IReportRepo";
import {RowDataPacket} from "mysql2";
import {injectable} from "inversify";

@injectable()
export class ReportMysqlRepo extends BaseMysqlRepo implements IReportRepo {
    totalOrder(startDate: Date, endDate: Date): ResultAsync<number, Error> {
        const query = `
            SELECT count(*) as count
            FROM \`order\`
            WHERE \`order\`.status = 2
              AND DATE(created_at) >= DATE(?)
              AND DATE(created_at) <= DATE(?)
        `
        return this.executeQuery(query,[startDate,endDate]).andThen(
            ([r,f]) => {
                const firstRow = (r as any)[0];
                if (!firstRow) {
                    return okAsync(0);
                }
                return okAsync(firstRow.count);
            }
        )

    }
    revenue(startDate: Date, endDate: Date): ResultAsync<Revenue[], Error> {
        const query = `
            SELECT DATE(created_at) as date,
                   SUM(final_amount) as revenue,
                   COUNT(DISTINCT id) as totalOrder
            FROM \`order\`
            WHERE \`order\`.status = 2
              AND DATE(created_at) >= DATE(?)
              AND DATE(created_at) <= DATE(?)
            GROUP BY DATE(created_at);
        `

        return this.executeQuery(query,[startDate,endDate]).andThen(
            ([r,f]) => {
                const rows = r as RowDataPacket[]
                console.log(rows)
                return ok(rows.map(row => {
                    return row as Revenue
                }))
            }
        )
    }

}