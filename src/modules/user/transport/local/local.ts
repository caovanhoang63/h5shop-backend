import {UserCreate} from "../../entity/userVar";
import {IAppContext} from "../../../../components/appContext/appContext";
import {UserBiz} from "../../biz/biz";
import {SystemRole} from "../../entity/user";
import {AppError} from "../../../../libs/errors";
import {Nullable} from "../../../../libs/nullable";
import {UserMysqlRepo} from "../../repository/mysql/mysqlRepo";
import {ResultAsync} from "neverthrow";

interface IUserBiz {
    CreateNewUser: (u: UserCreate) => ResultAsync<void,AppError>
}

export class UserLocal {
    private readonly userBiz: IUserBiz;

    constructor(private readonly appContext: IAppContext) {
        this.userBiz = new UserBiz(new UserMysqlRepo(appContext.GetDbConnectionPool()));
    }

    public CreateNewUser = async (firstName: string, lastName: string, userName: string, systemRole: SystemRole)
        : Promise<[number, Nullable<AppError>]> => {
        const data: UserCreate = {
            firstName: firstName, lastName: lastName, systemRole: systemRole, userName: userName
        };
        const result = await this.userBiz.CreateNewUser(data);
        if (result.isErr()) {
            return [0, result.error!]
        }
        return [data.id!, null]
    }
}