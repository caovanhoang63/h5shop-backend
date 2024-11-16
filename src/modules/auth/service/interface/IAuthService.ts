import {AuthCreate, AuthLogin, TokenResponse} from "../../entity/authVar";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";

export interface IAuthService {
    Register: (u: AuthCreate) => ResultAsync<void, Err>
    Login: (u: AuthLogin) => ResultAsync<TokenResponse, Err>
}
