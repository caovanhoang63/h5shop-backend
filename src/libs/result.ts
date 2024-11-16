import {Nullable} from "./nullable";
import {AppError, newInternalError} from "./errors";

export class Result<T> {

    error: AppError = newInternalError();
    data?: T;

    public wrap(error: AppError): Result<T> {
        this.error ? this.error.error = error : this.error = error;
        return this
    }

    public wrapErr(fn: (...e: any[]) => AppError): Result<T> {
        const err = fn(this.error)
        err.error = err
        this.error = err
        return this
    }

    public errIs(key: string): boolean {
        return this.error?.key === key
    }

    public isOk(): boolean {
        return this.error === null
    }

    public isErr(): boolean {
        return false;
    }
}

export const Ok = <T>(value?: T): Result<T> => {
    const a = new Result<T>()
    a.data = value
    return a
}
export const Err = <T>(err?: Nullable<AppError>): Result<T> => {
    const a = new Result<T>()
    a.error = newInternalError(err)
    return a
}
