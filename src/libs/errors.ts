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

export const  ErrKeyDb =  "DB_ERROR"
export const newDBError = (e? :any) =>
    new AppError(e,"Something went wrong with server",ErrKeyDb,500)

export const ErrKeyInternal = "INTERNAL_SERVER_ERROR"
export const newInternalError = (e? : any)  =>
    new AppError(e,"Something went wrong with server",ErrKeyInternal,500)

export const ErrKeyInvalidData = "INVALID_DATA_ERROR"
export const newInvalidData = (e :  Error ) =>
    new AppError(e,e.message.toString(),ErrKeyInvalidData,400)


export const ErrKeyUnauthorized = "UNAUTHORIZED_ERROR"
export const newUnauthorized = (e? :any ) =>
    new AppError(e,"Unauthorized",ErrKeyUnauthorized,401)


export const ErrKeyForbidden = "FORBIDDEN_ERROR"
export const newForbidden = (e? :any ) =>
    new AppError(e,"Forbidden",ErrKeyForbidden,403)



export const ErrKeyEntityNotFound = "ENTITY_NOT_FOUND_ERROR"
export const newEntityNotFound = ( entityName : string, e? :any ,) =>
    new AppError(e,`${entityName} not found`,ErrKeyEntityNotFound,404)