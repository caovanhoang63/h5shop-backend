import {Nullable} from "./nullable";

export type Result<T> = {
    Error?: Nullable<any>,
    Data: Nullable<T>,
}