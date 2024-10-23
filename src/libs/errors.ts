export interface AppError extends Error {
    message: string;
    code: number;
    error: AppError;
}
export const DBError = (e :any) : AppError=> {
    return {
        code: 500,
        error: e,
        message: "Something went wrong with DB",
        name: "Err_DB",
    }
}

export const InternalError = (e : any) : AppError => {
    return {
        code: 500,
        error: e,
        message: "Something went wrong with server",
        name: "Err_DB",
    }
}