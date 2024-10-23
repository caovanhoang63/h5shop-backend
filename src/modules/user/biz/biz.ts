import {UserCreate} from "../entity/userVar";
import {Result} from "../../../libs/result";
import {UserMysqlRepo} from "../repository/mysql/mysqlRepo";

interface IUserRepository {
    Create: (u: UserCreate) => Result<any>
}

export class UserBiz  {
    constructor(private readonly userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public CreateNewUser = (u : UserCreate) : Result<null> => {
        return {
            Error: null, Data: null
        }
    }
}



