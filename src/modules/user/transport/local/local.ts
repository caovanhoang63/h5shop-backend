import {UserCreate} from "../../entity/userCreate";
import {IAppContext} from "../../../../components/appContext/appContext";
import {UserService} from "../../service/userService";
import {SystemRole} from "../../entity/user";
import {Err} from "../../../../libs/errors";
import {Nullable} from "../../../../libs/nullable";
import {UserMysqlRepo} from "../../repository/implementation/mysqlRepo";
import {ResultAsync} from "neverthrow";

interface IUserBiz {
    createNewUser: (u: UserCreate) => ResultAsync<void, Err>
}

export class UserLocal {
    private readonly userBiz: IUserBiz;

    constructor(private readonly appContext: IAppContext) {
        this.userBiz = new UserService(new UserMysqlRepo(appContext.GetDbConnectionPool()));
    }

    public CreateNewUser = async (firstName: string, lastName: string, userName: string, systemRole: SystemRole)
        : Promise<[number, Nullable<Err>]> => {
        const data: UserCreate = {
            firstName: firstName, lastName: lastName, systemRole: systemRole, userName: userName
        };
        const result = await this.userBiz.createNewUser(data);
        if (result.isErr()) {
            return [0, result.error!]
        }
        return [data.id!, null]
    }
}