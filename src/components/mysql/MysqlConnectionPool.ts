import {inject, injectable} from "inversify";
import {PoolConnection} from "mysql2/promise";
import {Pool} from "mysql2";
import {TYPES} from "../../types";

export interface IConnectionPool {
    getConnection(): Promise<PoolConnection>;
}

@injectable()
export class MysqlConnectionPool implements IConnectionPool {
    private readonly pool;

    constructor(@inject(TYPES.ConnPool) pool: Pool) {
        this.pool = pool
    }

    getConnection(): Promise<PoolConnection> {
        return this.pool.promise().getConnection();
    }
}
