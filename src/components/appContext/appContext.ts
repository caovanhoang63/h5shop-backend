import mysql from "mysql2";
import {IPubSub} from "../pubsub";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";

export interface IAppContext {
    // GetDbConnectionPool: () => mysql.Pool;
    GetPubsub: () => IPubSub
}


@injectable()
export class AppContext implements IAppContext {
    // private readonly connectionPool: mysql.Pool;
    private readonly ps: IPubSub;

    constructor(@inject(TYPES.IPubSub)  ps: IPubSub) {
        // this.connectionPool = connectionPool;
        this.ps = ps;
    }

    public GetPubsub = () => {
        return this.ps;
    };

    // public GetDbConnectionPool = (): mysql.Pool => {
    //     // return this.connectionPool
    // };


}