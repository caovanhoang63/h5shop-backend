import mysql from "mysql2";
import {AppError, newDBError} from "./errors";

export  class MysqlErrHandler {
    public static handler(err : any, entityName: string ) : AppError {
        if (err.code === 'ER_DUP_ENTRY'){
            return ErrEntityAlreadyExists(err, entityName);
        }
        return newDBError(err)
    }
}

export const KeyAlreadyExists = 'ALREADY_EXISTED_ERROR'
export const ErrEntityAlreadyExists = (e : any, entityName: string) =>
    new AppError(e, `${entityName} already existed`, KeyAlreadyExists, 400)
