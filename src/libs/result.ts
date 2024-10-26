import {Nullable} from "./nullable";
import {AppError, newInternalError} from "./errors";

export class Result<T> {
    constructor(value: T | undefined, err: Nullable<AppError>) {
        this.data = value;
        this.error = err;
    }

    error: Nullable<AppError>;
    data?: T;

    public wrap(error: AppError): Result<T>  {
        this.error ? this.error.error = error : this.error = error;
        return this
    }

    public wrapErr(fn : (...e: any[]) => AppError): Result<T>  {
        const err = fn(this.error)
        err.error = err
        this.error = err
        return this
    }

    public errIs(key : string) : boolean {
        return this.error?.key === key
    }

    public isOk(): boolean {
        return this.error === null
    }

    public isErr(): boolean {
        return this.error !== null
    }
}

export const Ok = <T>(value?: T ): Result<T> => {
    return new Result<T>(value,null)
}
export const Err = <T>(err? : Nullable<AppError>): Result<T> => {
    if (!err)
        return new Result<T>(undefined, newInternalError(err))
    return new Result<T>(undefined, err )
}
