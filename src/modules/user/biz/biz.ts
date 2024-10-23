import {UserCreate} from "../entity/userVar";
import {Result} from "../../../libs/result";
import {DBError, InternalError, isSameErr} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";

interface IUserRepository {
    Create: (u: UserCreate) => Promise<Result<null>>
    FindByCondition : (condition: ICondition,paging : Paging)=> Promise<Result<User[]>>
}

export class UserBiz  {
    constructor(private readonly userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public CreateNewUser = async (u : UserCreate) : Promise<Result<null>> => {
        const result =  await this.userRepository.Create(u)
        if (!result.error) {
        }
        else if (isSameErr(result.error,DBError(null))) {
            return {
                error : InternalError(result.error),
            }
        }
        return result;
    }

    public ListUsers =  async () : Promise<Result<User[]>> => {
        return await this.userRepository.FindByCondition(
            {
                firstName: "caovanhoang",
            },
            {
                cursor: 0, limit: 0, nextCursor: 0, page: 0, total: 0
            }
        )

    }
}



