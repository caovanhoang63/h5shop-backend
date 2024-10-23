import {AuthCreate} from "../entity/authVar";
import {Result} from "../../../libs/result";
import {Auth} from "../entity/auth";
import {errAsync, okAsync, ResultAsync} from "../../../libs/resultAsync";
import {ErrDbKey, InternalError} from "../../../libs/errors";
import {ErrUserNameAlreadyExists} from "../entity/error";
import {randomSalt} from "../../../libs/salt";

interface IAuthRepository {
    Create: (u : AuthCreate) => ResultAsync<void>
    FindByUserName: (userName: string ) => ResultAsync<Auth>
}

export interface IHasher {
    hash: (value : string, salt :string ) => string
}

export class AuthBiz {
    constructor(private readonly authRepo: IAuthRepository, private readonly hasher : IHasher) {

    }

    // @ts-ignore
    public Register= async  (u : AuthCreate) : ResultAsync<void> =>  {
        const old = await this.authRepo.FindByUserName(u.userName)
        if (old.isErr() && old.errIs(ErrDbKey)) {
            return errAsync<void>(old.wrapBy(InternalError).error!)
        }

        if (old.data) {
            return errAsync<void>(ErrUserNameAlreadyExists(u.userName))
        }


        u.salt = randomSalt(50)
        u.password = this.hasher.hash(u.password,u.salt)

        const r = await this.authRepo.Create(u)

        if (r.isErr() && r.errIs(ErrDbKey)) {
            return errAsync<void>(old.wrapBy(InternalError).error!)
        }

        return okAsync<void>(undefined)
    }
}