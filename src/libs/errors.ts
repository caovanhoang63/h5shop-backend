export interface AppError extends Error {
    message: string;
    code: number;
    error: AppError;
    key: string;
}
export const DBError = (e :any) : AppError=> {
    return {
        code: 500,
        error: e,
        message: "Something went wrong with DB",
        name: "Database Error ",
        key: "ERR_DB"
    }
}

export const InternalError = (e : any) : AppError => {
    return {
        code: 500,
        error: e,
        message: "Something went wrong with server",
        name: "Internal Server Error",
        key: "INTERNAL_SERVER_ERROR"
    }
}

export const isSameErr = (Err1 : AppError, Err2 :AppError) => {
    return Err1.key === Err2.key
}