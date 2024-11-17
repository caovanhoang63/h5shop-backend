import 'reflect-metadata';
import {Container} from 'inversify';
import {TYPES} from "./types";
import {IAuthRepository} from "./modules/auth/repository/IAuthRepository";
import {PrmAuthRepo} from "./modules/auth/repository/implementation/prmAuthRepo";
import  UserLocal from "./modules/user/transport/local/local";
import {AuthService, IHasher} from "./modules/auth/service/implementation/authService";
import {Hasher} from "./libs/hasher";
import {IJwtProvider, jwtProvider} from "./components/jwtProvider/IJwtProvider";
import {IAuthService} from "./modules/auth/service/interface/IAuthService";
import {IUserLocalRepository} from "./modules/user/transport/IUserLocalRepository";
import {IUserService} from "./modules/user/service/IUserService";
import {UserService} from "./modules/user/service/userService";
import {IUserRepository} from "./modules/user/repository/IUserRepository";
import {PrmUserRepo} from "./modules/user/repository/implementation/prmUserRepo";
import {IPubSub} from "./components/pubsub";
import {LocalPubSub} from "./components/pubsub/local";


const container = new Container();
//Repository
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(PrmAuthRepo);
container.bind<IUserLocalRepository>(TYPES.IUserLocalRepository).to(UserLocal);
container.bind<IUserRepository>(TYPES.IUserService).to(PrmUserRepo);

//Service
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IUserService>(TYPES.IUserService).to(UserService)


// Util
container.bind<IHasher>(TYPES.IHasher).to(Hasher);
container.bind<IJwtProvider>(TYPES.IJwtProvider).to(jwtProvider);
container.bind<IPubSub>(TYPES.IPubSub).to(LocalPubSub);



export { container };