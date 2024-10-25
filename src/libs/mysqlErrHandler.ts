import mysql from "mysql2";
import {AppError, DBError} from "./errors";

export  class MysqlErrHandler {
    public static handler(err : any, entityName: string ) : AppError {
        if (err.code === 'ER_DUP_ENTRY'){
            return ErrEntityAlreadyExists(err, entityName);
        }
        return DBError(err)
    }
}

export const KeyAlreadyExists = 'ERR_ALREADY_EXISTED'
export const ErrEntityAlreadyExists = (e : any, entityName: string) =>
    new AppError(e, `${entityName} already existed`, KeyAlreadyExists, 400)
