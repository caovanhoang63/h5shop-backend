import {UserCreate} from "../entity/userVar";
import {Result} from "../../../libs/result";
import {UserMysqlRepo} from "../repository/mysql/mysqlRepo";

interface IUserRepository {
    Create: (u: UserCreate) => Promise<Result<null>>
}

export class UserBiz  {
    constructor(private readonly userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public CreateNewUser = async (u : UserCreate) : Promise<Result<null>>  => {
        return  await this.userRepository.Create(u)
    }
}



