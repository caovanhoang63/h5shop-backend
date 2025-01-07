import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {AuthChangePassword, AuthCreate} from "../../entity/authCreate";
import {AuthLogin} from "../../entity/authLogin";
import {TokenResponse} from "../../entity/authVar";
import {IRequester} from "../../../../libs/IRequester";

export interface IAuthService {
    register: (requester: IRequester, u: AuthCreate) => ResultAsync<void, Err>
    login: (requester: IRequester, u: AuthLogin) => ResultAsync<TokenResponse, Err>
    introspectToken: (token: string) => ResultAsync<IRequester, Err>
    changePassword(requester : IRequester,userId : number, u: AuthChangePassword): ResultAsync<void, Err>
}
