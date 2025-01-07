import {Auth} from "../entity/auth";
import {Nullable} from "../../../libs/nullable";
import {Err} from "../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {AuthChangePassword, AuthCreate} from "../entity/authCreate";
import {IBaseRepo} from "../../../libs/IBaseRepo";

export interface IAuthRepository extends IBaseRepo {
    Create: (u: AuthCreate) => ResultAsync<void, Err>
    FindByUserName: (userName: string) => ResultAsync<Nullable<Auth>, Err>
    FindByUserId: (id: number) => ResultAsync<Nullable<Auth>, Err>
    changePassword(userId : number,u: AuthChangePassword): ResultAsync<void, Error>
}