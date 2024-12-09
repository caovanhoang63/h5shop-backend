import mysql, { ResultSetHeader, RowDataPacket } from "mysql2";
import { InventoryItemCreate, Inventory } from "../../entity/inventory";
import { Err, Ok } from "../../../../libs/result";
import { ICondition } from "../../../../libs/condition";
import { SqlHelper } from "../../../../libs/sqlHelper";
import { Paging } from "../../../../libs/paging";
import { ResultAsync } from "../../../../libs/resultAsync";

export class InventoryMysqlRepo {
    private readonly pool: mysql.Pool;
    constructor(pool : mysql.Pool) {
        this.pool = pool
    }
    public Create = (item: InventoryItemCreate): ResultAsync<void> => {
        const query = `INSERT INTO inventory (sku_id, amount) VALUES (?, ?)`;
        return ResultAsync.fromPromise(
            this.pool.promise().query(query, [item.skuId, item.amount])
                .then(([r, f]) => {
                    const a = r as ResultSetHeader;
                    return Ok<void>(undefined);
                })
                .catch((err) => Err<any>(err))
        );
    }

    public FindByCondition = (cond: ICondition, paging: Paging): ResultAsync<Inventory[]> => {
        const [whereClause, values] = SqlHelper.BuildWhereClause(cond);
        const query = `SELECT * FROM inventory ${whereClause}`;
        return ResultAsync.fromPromise(
            this.pool.promise().query(query, values)
                .then(([r, f]) => {
                    const a = r as RowDataPacket[];
                    const data: Inventory[] = a.map(row => SqlHelper.ConvertKeysToCamelCase(row) as Inventory);
                    paging.total = a.length;
                    return Ok(data);
                })
                .catch((err) => Err<Inventory[]>(err))
        );
    }

    public Update = (id: number, item: Partial<Inventory>): ResultAsync<void> => {
        const [setClauses, values] = SqlHelper.BuildSetClause(item);
        const query = `UPDATE inventory SET ${setClauses} WHERE id = ?`;
        return ResultAsync.fromPromise(
            this.pool.promise().query(query, [...values, id])
                .then(() => Ok<void>(undefined))
                .catch((err) => Err<any>(err))
        );
    }

    public Delete = (id: number): ResultAsync<void> => {
        const query = `DELETE FROM inventory WHERE id = ?`;
        return ResultAsync.fromPromise(
            this.pool.promise().query(query, [id])
                .then(() => Ok<void>(undefined))
                .catch((err) => Err<any>(err))
        );
    }
}

