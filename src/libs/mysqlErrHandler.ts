import {createDatabaseError, Err} from "./errors";

export class MysqlErrHandler {
    public static handler(err: any, entityName: string): Err {
        if (err.code === 'ER_DUP_ENTRY') {
            return ErrEntityAlreadyExists(err, entityName);
        }
        return createDatabaseError(err)
    }
}

export const KeyAlreadyExists = 'ALREADY_EXISTED_ERROR'

export const ErrEntityAlreadyExists = (e: any, entityName: string) =>
    new Err({
        code: 400,
        key: KeyAlreadyExists,
        message: `${entityName} already existed`,
        metadata: undefined,
        originalError: e
    })
