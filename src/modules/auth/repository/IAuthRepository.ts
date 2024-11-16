import {AuthCreate} from "../entity/authVar";
import {Auth} from "../entity/auth";
import {Nullable} from "../../../libs/nullable";
import {Err} from "../../../libs/errors";
import {ResultAsync} from "neverthrow";

export interface IAuthRepository {
    Create: (u: AuthCreate) => ResultAsync<void, Err>
    FindByUserName: (userName: string) => ResultAsync<Nullable<Auth>, Err>
    FindByUserId: (id: number) => ResultAsync<Nullable<Auth>, Err>
}