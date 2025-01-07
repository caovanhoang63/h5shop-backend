import {ok, okAsync, ResultAsync} from "neverthrow";
import { Paging } from "../../../libs/paging";
import { WarrantyFilter } from "../entity/filter";
import { WarrantyForm } from "../entity/warrantyForm";
import { WarrantyFormCreate } from "../entity/warrantyFormCreate";
import {IWarrantyRepo} from "./IWarrantyRepo";
import {injectable} from "inversify";
import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../libs/sqlHelper";

@injectable()
export class WarrantyMysqlRepo extends BaseMysqlRepo implements IWarrantyRepo {
    create(create: WarrantyFormCreate): ResultAsync<void, Error> {
        const query = `INSERT INTO
                            warranty_form(warranty_type, customer_id, customer_phone_number, stock_in_id, sku_id, order_id, amount, return_date, note)
                            VALUES (?,?,?,?,?,?,?,?,?)`
        return this.executeQuery(query,[create.warrantyType,create.customerId,create.customerPhoneNumber,create.stockInId,create.skuId,create.orderId,create.amount,create.returnDate,create.note]).
        andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader
                create.id =  header.insertId
                return okAsync(undefined)
            }
        )
    }
    findById(id: number): ResultAsync<WarrantyForm | null, Error> {
        const query = `SELECT * FROM warranty_form WHERE id = ? LIMIT 1`;
        return this.executeQuery(query, [id]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return ok(null);
                }
                return ok(SqlHelper.toCamelCase(firstRow) as WarrantyForm)
            }
        )
    }
    findMany(filter: WarrantyFilter, paging: Paging): ResultAsync<WarrantyForm[], Error> {
        const [whereClause,whereValue] = SqlHelper.buildWhereClause(filter)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const query = `SELECT * FROM warranty_form ${whereClause} ${pagingClause}`;
        const countQuery = `SELECT COUNT(id) as total FROM warranty_form ${whereClause}`;
        return this.executeQuery(countQuery,[whereValue]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return okAsync({total: 0});
                }
                paging.total = firstRow.total;
                return ok({total: firstRow.total});
            }
        ).andThen(
            (r) => {
                if(r.total == 0)
                    return ok([]);
                else
                    return this.executeQuery(query,whereValue).andThen(
                        ([r,f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as WarrantyForm);
                            return ok(data)
                        }
                    )
            })

    }
}