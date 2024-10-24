import {AuthCreate} from "../entity/authVar";
import {Err, Ok, Result} from "../../../libs/result";
import {Auth} from "../entity/auth";
import {errAsync, okAsync, ResultAsync} from "../../../libs/resultAsync";
import {AppError, ErrDbKey, InternalError} from "../../../libs/errors";
import {ErrUserNameAlreadyExists} from "../entity/error";
import {randomSalt} from "../../../libs/salt";
import {SystemRole, User} from "../../user/entity/user";
import {Nullable} from "../../../libs/nullable";
import {schema} from "../entity/validate";
import {Validator} from "../../../libs/validator";

interface IAuthRepository {
    Create: (u : AuthCreate) => ResultAsync<void>
    FindByUserName: (userName: string ) => ResultAsync<Auth>
}

interface IUserRepository {
    CreateNewUser(firstName: string, lastName: string, userName: string , systemRole: SystemRole ) : Promise<[number, Nullable<AppError> ]>
}

export interface IHasher {
    hash: (value : string, salt :string ) => string
}

export class AuthBiz {
    constructor(private readonly authRepo: IAuthRepository, private readonly hasher : IHasher, private readonly userRepo : IUserRepository) {

    }

    public Register=  (u : AuthCreate) : ResultAsync<void>=>  {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(schema,u))
                if (vR.isErr()) {
                    return vR
                }
                const old = await this.authRepo.FindByUserName(u.userName)
                if (await Validator(schema,u)) {

                }
                if (old.isErr() && old.errIs(ErrDbKey)) {
                    return old.wrapBy(InternalError) as Result<void>
                }

                if (old.data) {
                    return Err<void>(ErrUserNameAlreadyExists(u.userName))
                }

                const [user, err]  = await this.userRepo.CreateNewUser(u.firstName,u.lastName,u.userName,u.systemRole)

                if (err != null ) {
                    return Err<void>(err)
                }

                u.userId = user
                u.salt = randomSalt(50)
                u.password = this.hasher.hash(u.password,u.salt)


                const r = await this.authRepo.Create(u)

                if (r.isErr() && r.errIs(ErrDbKey)) {
                    return Err<void>(old.wrapBy(InternalError).error!)
                }

                return Ok<void>(undefined)
            })()
        )

    }
}