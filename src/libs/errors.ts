import {Nullable} from "./nullable";

export type ErrKey = string

export class AppError extends Error {
    public constructor(e : any,  message: string ,key : string, code: number ) {
        super(message);
        this.code = code;
        this.error = e;
        this.key = key;
    }

    public code: number;
    public error?: Nullable<AppError>;
    public key: string;
    public isSame(e : AppError) : boolean {
        return this.key === e.key
    }
}

export const  ErrDbKey =  "ERR_DB"
export const DBError = (e? :any) =>
    new AppError(e,"Something went wrong with DB",ErrDbKey,500)

export const InternalErrKey = "INTERNAL_SERVER_ERROR"
export const InternalError = (e? : any)  =>
    new AppError(e,"Something went wrong with server",InternalErrKey,500)


