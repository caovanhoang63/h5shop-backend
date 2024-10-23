import mysql, {Connection} from "mysql2";
import {UserCreate} from "../../entity/userVar";
import {Result} from "../../../../libs/result";

export class UserMysqlRepo {
    private readonly pool: mysql.Pool;
    constructor(pool : mysql.Pool) {
        this.pool = pool
    }

    public Create = (u : UserCreate) : Result<null> => {
        return {
            Error: null,
            Data: null
        }
    }
}