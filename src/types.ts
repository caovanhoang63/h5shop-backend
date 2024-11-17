import {IUserLocalRepository} from "./modules/user/transport/IUserLocalRepository";

const TYPES = {
    // REPOSITORY
    IAuthRepository: Symbol.for("IAuthRepository"),
    IUserLocalRepository: Symbol.for("IUserLocalRepository"),
    IUserRepository: Symbol.for("IUserRepository"),

    // SERVICE
    IAuthService: Symbol.for("IAuthService"),
    IUserService: Symbol.for("IUserService"),


    // UTILS
    IHasher: Symbol.for("IHasher"),
    IJwtProvider: Symbol.for("IJwtProvider"),
    IPubSub : Symbol.for("IPubSub"),
};
export { TYPES };