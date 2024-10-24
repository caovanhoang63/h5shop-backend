import mysql, {RowDataPacket} from "mysql2";
import {AuthCreate} from "../../entity/authVar";
import {ResultAsync} from "../../../../libs/resultAsync";
import {Auth} from "../../entity/auth";
import {Err, Ok} from "../../../../libs/result";
import {User} from "../../../user/entity/user";
import {SqlHelper} from "../../../../libs/sqlHelper";

export class AuthMysqlRepo {
    constructor(private readonly pool : mysql.Pool) {
    }

    Create=  (u : AuthCreate) : ResultAsync<void> =>{
        const query = `INSERT INTO auth (user_id, user_name, salt, password) VALUES (?, ? ,? ,?)`
        return ResultAsync.fromPromise(this.pool.promise().query(query,[u.userId,u.userName,u.salt,u.password])
            .then(([row,field]) => {
                console.log(row)
                return Ok<void>(undefined)
            })
            .catch(
                e =>  Err(e)
            )
        )
    }

    FindByUserName =  (userName: string ) :ResultAsync<Auth> => {
        const query = `SELECT * FROM auth WHERE user_name = ? LIMIT 1`;
        return ResultAsync.fromPromise(this.pool.promise().query(query,[userName],)
            .then(([r,f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0 ) {
                    return Ok<Auth>()
                }
                const data :Auth = SqlHelper.ConvertKeysToCamelCase(a[0]);
                return Ok<Auth>(data)

            })
            .catch(
                e =>  Err<Auth>(e)
            )
        )
    }

}