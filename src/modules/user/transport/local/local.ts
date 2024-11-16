import {UserCreate} from "../../entity/userCreate";
import {IAppContext} from "../../../../components/appContext/appContext";
import {UserService} from "../../service/userService";
import {SystemRole} from "../../entity/user";
import {Err} from "../../../../libs/errors";
import {Nullable} from "../../../../libs/nullable";
import {PrmUserRepo} from "../../repository/implementation/prmUserRepo";
import {IUserBiz} from "../../service/IUserBiz";
import {injectable} from "inversify";
import {IUserLocalRepository} from "../IUserLocalRepository";




@injectable()
 class UserLocal implements IUserLocalRepository {
    private readonly userBiz: IUserBiz;

    constructor() {
        this.userBiz = new UserService(new PrmUserRepo());
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

export default UserLocal;