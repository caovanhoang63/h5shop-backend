import {ResultAsync} from "neverthrow";
import {Err} from "./errors";


export interface IBaseRepo {
    Commit() : ResultAsync<void, Err>
    Rollback() : ResultAsync<void, Err>
    Begin() : ResultAsync<void, Err>
}

