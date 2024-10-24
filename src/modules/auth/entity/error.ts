import {AppError, ErrDbKey} from "../../../libs/errors";
import {UserCreate} from "../../user/entity/userVar";

export const ErrUserNameAlreadyExists = (userName: string) =>
    new AppError(null,`User name ${userName} already existed!`, "ERR_USER_NAME_EXISTED",400)

export const ErrPasswordNotStrongEnough = () =>
    new AppError(null,`Password not strong enough`, "ERR_INVALID_PASSWORD",400)
