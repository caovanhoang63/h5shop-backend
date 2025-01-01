import {FieldPacket, PoolConnection, QueryResult} from 'mysql2/promise';
import {errAsync, ok, okAsync, Result, ResultAsync} from 'neverthrow';
import {IBaseRepo} from "../../libs/IBaseRepo";
import {createDatabaseError, Err} from "../../libs/errors";
import {inject} from "inversify";
import {IConnectionPool} from "./MysqlConnectionPool";
import {TYPES} from "../../types";
import {MysqlErrHandler} from "../../libs/mysqlErrHandler";


export abstract class BaseMysqlRepo implements IBaseRepo {
    protected connection?: PoolConnection;
    protected hasActiveTransaction: boolean = false;

    constructor(@inject(TYPES.IConnectionPool) protected readonly pool: IConnectionPool) {
    }

    protected getConnection(): ResultAsync<PoolConnection, Err> {
        if (!this.connection) {
            return ResultAsync.fromPromise(
                this.pool.getConnection(),
                e => createDatabaseError(e)
            ).andThen(conn => {
                this.connection = conn;
                return ok(conn);
            });
        }
        return okAsync(this.connection);
    }

    Begin(): ResultAsync<void, Err> {
        return this.getConnection()
            .andThen(conn =>
                ResultAsync.fromPromise(
                    conn.beginTransaction(),
                    e => createDatabaseError(e)
                )
            )
            .andThen(() => {
                this.hasActiveTransaction = true;
                return ok(undefined);
            });
    }

    Commit(): ResultAsync<void, Err> {
        if (!this.connection || !this.hasActiveTransaction) {
            return errAsync(createDatabaseError(new Error('No active transaction')));
        }

        return ResultAsync.fromPromise(
            this.connection.commit(),
            e => createDatabaseError(e)
        )
            .andThen(() => {
                this.hasActiveTransaction = false;
                return this.releaseConnection();
            })
            .andThen(() => ok(undefined));
    }

    Rollback(): ResultAsync<void, Err> {
        if (!this.connection || !this.hasActiveTransaction) {
            return errAsync(createDatabaseError(new Error('No active transaction')));
        }

        return ResultAsync.fromPromise(
            this.connection.rollback(),
            e => createDatabaseError(e)
        )
            .andThen(() => {
                this.hasActiveTransaction = false;
                return this.releaseConnection();
            })
            .andThen(() => ok(undefined));
    }

    protected releaseConnection(): Result<void, Err> {
        if (this.connection) {
            this.connection.release();
            this.connection = undefined;
        }
        return ok(undefined);
    }


    protected executeInTransaction<T>(
        operation: (conn: PoolConnection) => ResultAsync<T, Err>
    ): ResultAsync<T, Err> {
        const shouldManageTransaction = !this.hasActiveTransaction;

        if (shouldManageTransaction) {
            return this.Begin()
                .andThen(() => this.getConnection())
                .andThen(conn => operation(conn))
                .andThen(result =>
                    this.Commit()
                        .andThen(() => ok(result))
                )
                .orElse(error =>
                    this.Rollback()
                        .andThen(() => errAsync(error))
                        .orElse(() => errAsync(error))
                );
        }

        return this.getConnection().andThen(conn => operation(conn));
    }

    protected executeQuery<T>(
        query: string,
        params: any[] = []
    ): ResultAsync<[QueryResult, FieldPacket[]], Err> {
        return this.getConnection()
            .andThen(conn =>
                ResultAsync.fromPromise(
                    conn.query(query, params)
                        .then((row) => row),
                    e => {
                        console.log(e)
                        return  MysqlErrHandler.handler(e, "entity")
                    }
                )
            );
    }
}