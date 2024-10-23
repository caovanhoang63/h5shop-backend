import mysql from "mysql2";

export interface IAppContext {
    GetDbConnectionPool: () => mysql.Pool;
}


export class AppContext implements IAppContext {
    private readonly connectionPool: mysql.Pool;
    constructor(connectionPool: mysql.Pool) {
        this.connectionPool = connectionPool;
    }

    public GetDbConnectionPool =  () : mysql.Pool => {
        return this.connectionPool
    };
}

