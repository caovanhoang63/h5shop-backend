import {UserCreate} from "../entity/userVar";
import {Result} from "../../../libs/result";
import {DBError, ErrDbKey, InternalError} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";
import {ResultAsync} from "../../../libs/resultAsync";
import {AsyncResource} from "node:async_hooks";

interface IUserRepository {
    Create: (u: UserCreate) => ResultAsync<void>
    FindByCondition : (condition: ICondition,paging : Paging) => ResultAsync<User[]>
}

export class UserBiz  {
    constructor(private readonly userRepository: IUserRepository) {
    }

    public CreateNewUser =(u : UserCreate) => {
        return this.userRepository.Create(u)
    }

    public ListUsers =  ()  => {
        const cond = {
            firstName : "caovanhoang"
        }

        const paging : Paging= {
            cursor: 0, limit: 0, nextCursor: 0, page: 0, total: 0

        }

        return this.userRepository.FindByCondition(cond,paging)

    }
}



