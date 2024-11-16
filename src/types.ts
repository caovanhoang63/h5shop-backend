import {IUserLocalRepository} from "./modules/user/transport/IUserLocalRepository";

const TYPES = {
    IAuthRepository: Symbol.for("IAuthRepository"),
    IUserLocalRepository: Symbol.for("IUserLocalRepository"),
    IHasher: Symbol.for("IHasher"),
    IJwtProvider: Symbol.for("IJwtProvider"),
    IAuthService: Symbol.for("IAuthService"),
};
export { TYPES };