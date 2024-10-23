import mysql, {Connection, ResultSetHeader, RowDataPacket} from "mysql2";
import {UserCreate} from "../../entity/userVar";
import {Result} from "../../../../libs/result";
import e from "cors";
import {DBError} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {User} from "../../entity/user";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Paging} from "../../../../libs/paging";

export class UserMysqlRepo {
    private readonly pool: mysql.Pool;
    constructor(pool : mysql.Pool) {
        this.pool = pool
    }

    public Create =async  (u : UserCreate) :Promise<Result<null>> => {
        const  result : Result<null> = {
            error: null,
            data: null
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
            result.error = DBError(err)
            return
        })
        return result;
    }

    public FindByCondition = async (cond: ICondition, paging: Paging): Promise<Result<User[]>> => {
        const result: Result<User[]> = {
            error: null,
            data: [],
        };
        const [whereClause, values] =  SqlHelper.BuildWhereClause(cond)
        const query = `SELECT * FROM user ${whereClause}`;

        await this.pool.promise().query(query,values).then(
            ([r,f]) => {
                const a = r as RowDataPacket[]
                if (a && Array.isArray(a) && a.length > 0) {
                    const camelCaseUser = SqlHelper.ConvertKeysToCamelCase(a[0]);
                    result.data?.push(camelCaseUser as User);
                }
                paging.total = a.length;
            }
        ).catch((err) => {
            result.error = DBError(err)
            return
        })
        return result;
    }
}