import {AppError, ErrDbKey} from "../../../libs/errors";

export const ErrUserNameAlreadyExists = (userName: string) =>
    new AppError(null,`User name ${userName} already existed!`, "ERR_USER_NAME_EXISTED",500)
