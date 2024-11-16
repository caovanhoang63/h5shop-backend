import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {AuthCreate} from "../../entity/authCreate";
import {AuthLogin} from "../../entity/authLogin";
import {TokenResponse} from "../../entity/authVar";

export interface IAuthService {
    register: (u: AuthCreate) => ResultAsync<void, Err>
    login: (u: AuthLogin) => ResultAsync<TokenResponse, Err>
}
