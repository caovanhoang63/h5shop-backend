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


const container = new Container();
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(PrmAuthRepo);
container.bind<IHasher>(TYPES.IHasher).to(Hasher);
container.bind<IJwtProvider>(TYPES.IJwtProvider).to(jwtProvider);
container.bind<IUserLocalRepository>(TYPES.IUserLocalRepository).to(UserLocal);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

export { container };