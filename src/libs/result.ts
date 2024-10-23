import {Nullable} from "./nullable";
import {AppError} from "./errors";
import {Paging} from "./paging";

export type Result<T> = {
    error?: Nullable<AppError>,
    data?: Nullable<T> ,
}