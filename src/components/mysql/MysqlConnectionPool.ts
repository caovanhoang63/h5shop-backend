import {injectable} from "inversify";
import {PoolConnection} from "mysql2/promise";
import conPool from "../../mysql";

export interface IConnectionPool {
    getConnection(): Promise<PoolConnection>;
}

@injectable()
export class MysqlConnectionPool implements IConnectionPool {
    private readonly pool;
    constructor() {
        this.pool = conPool
    }

    getConnection(): Promise<PoolConnection> {
        return this.pool.promise().getConnection();
    }
}
