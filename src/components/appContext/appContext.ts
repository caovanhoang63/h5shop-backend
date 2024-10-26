import mysql from "mysql2";
import {IPubSub} from "../pubsub";

export interface IAppContext {
    GetDbConnectionPool: () => mysql.Pool;
    GetPubsub: () => IPubSub
}


export class AppContext implements IAppContext {
    private readonly connectionPool: mysql.Pool;
    private readonly ps: IPubSub;
    constructor(connectionPool: mysql.Pool,ps : IPubSub) {
        this.connectionPool = connectionPool;
        this.ps = ps;
    }

    public GetPubsub=  () => {
        return this.ps;
    };

    public GetDbConnectionPool = (): mysql.Pool => {
        return this.connectionPool
    };


}