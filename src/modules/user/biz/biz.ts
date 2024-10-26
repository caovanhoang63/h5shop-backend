import {UserCreate, userCreateSchema} from "../entity/userVar";
import {Err, Ok} from "../../../libs/result";
import {newEntityNotFound, newForbidden} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {SystemRole, User} from "../entity/user";
import {ResultAsync} from "../../../libs/resultAsync";
import {Validator} from "../../../libs/validator";
import {Requester} from "../../../libs/requester";

interface IUserRepository {
    Create: (u: UserCreate) => ResultAsync<void>
    FindByCondition : (condition: ICondition,paging : Paging) => ResultAsync<User[]>
    FindByUserId : (id : number) =>  ResultAsync<User>
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

    public RequiredRole = (r : Requester, ...roles : SystemRole[]) : ResultAsync<any> =>  {
        return ResultAsync.fromPromise(
            (async () => {
                const uR = await this.userRepository.FindByUserId(r.userId);
                if (uR.isErr()) {
                    return uR
                }

                if (!uR.data) {
                    return uR.wrapBy(newEntityNotFound)
                }
                const data = uR.data

                if (data.systemRole === SystemRole.Admin) {
                    return Ok<any>(undefined);
                }

                if (roles.length > 0 && !roles.includes(data.systemRole)) {
                    return Err<any>(newForbidden())
                }
                return Ok<any>(undefined);
            })()
        )
    }

    public ListUsers =  ()  => {
        const cond = {}

        const paging : Paging= {
            cursor: 0, limit: 0, nextCursor: 0, page: 0, total: 0

        }

        return this.userRepository.FindByCondition(cond,paging)

    }
}



