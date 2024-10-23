import {Nullable} from "./nullable";

export type Result<T> = {
    Error?: Nullable<Error>,
    Data: Nullable<T>,
}