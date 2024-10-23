import mysql, {Connection, ResultSetHeader} from "mysql2";
import {UserCreate} from "../../entity/userVar";
import {Result} from "../../../../libs/result";
import e from "cors";

export class UserMysqlRepo {
    private readonly pool: mysql.Pool;
    constructor(pool : mysql.Pool) {
        this.pool = pool
    }

    public Create =async  (u : UserCreate) :Promise<Result<null>> => {
        const  result : Result<null> = {
            Error: null,
            Data: null
        };
        await this.pool.promise().query(`INSERT INTO user (first_name,last_name,system_role) VALUES (?, ? , ? ) `,
            [u.firstName,u.lastName,u.systemRole.toString()],
        ).then(
            ([r,f]) => {
                console.log(r)
                const a = r as ResultSetHeader
                console.log(f);
                u.id = a.insertId;

            }
        ).catch((err) => {
            console.log(err);
            result.Error = Error(err);
        })

        return result;
    }
}