import {Nullable} from "./nullable";
import {AppError, newInternalError} from "./errors";
import {Paging} from "./paging";

export class Result<T> {
    constructor(value : Nullable<T>, err : Nullable<AppError>) {
        this.data = value;
        this.error = err;
    }

    error: Nullable<AppError>;
    data: Nullable<T>;

    public wrap(error: AppError): Result<T>  {
        this.error ? this.error.error = error : this.error = error;
        return this
    }

    public wrapBy(fn : (e: any) => AppError): Result<T>  {
        const err = fn(this.error)
        err.error = err
        this.error = err
        return this
    }

    public isSameErr(Err:AppError) : boolean {
        return this.error?.code === Err.code
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

export const Ok = <T>(value?: Nullable<T> ): Result<T> => {
    if (!value) {
        return new Result<T>(null,null)
    }
    return new Result<T>(value,null)
}
export const Err = <T>(err? : Nullable<AppError>): Result<T> => {
    if (!err)
        return new Result<T>(null, newInternalError(err))
    return new Result<T>(null, err )
}
