import {UserCreate, userCreateSchema} from "../entity/userVar";
import {Ok} from "../../../libs/result";
import {ErrDbKey, InternalError} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";
import {ResultAsync} from "../../../libs/resultAsync";
import {Validator} from "../../../libs/validator";

interface IUserRepository {
    Create: (u: UserCreate) => ResultAsync<void>
    FindByCondition : (condition: ICondition,paging : Paging) => ResultAsync<User[]>
}

export class UserBiz  {
    constructor(private readonly userRepository: IUserRepository) {
    }

    public CreateNewUser = (u : UserCreate)   => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(userCreateSchema, u))
                if (vR.isErr()) {
                    return vR
                }

               const r =  await this.userRepository.Create(u);
               if (r.isErr()) {
                   return r
               }
               return Ok<void>(undefined);
            })()
        )
    }

    public ListUsers =  ()  => {
        const cond = {
            firstName : "cap"
        }

        const paging : Paging= {
            cursor: 0, limit: 0, nextCursor: 0, page: 0, total: 0

        }

        return this.userRepository.FindByCondition(cond,paging)

    }
}



