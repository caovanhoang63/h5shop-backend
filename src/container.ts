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
import {IAuditService} from "./modules/audit/service/IAuditService";
import {AuditService} from "./modules/audit/service/auditService";
import {IAuditRepository} from "./modules/audit/repository/IAuditRepository";
import {AuditPrmRepo} from "./modules/audit/repository/auditPrmRepo";
import {AppContext, IAppContext} from "./components/appContext/appContext";


const container = new Container();
//Repository
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(PrmAuthRepo).inRequestScope();
container.bind<IUserLocalRepository>(TYPES.IUserLocalRepository).to(UserLocal).inRequestScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(PrmUserRepo).inRequestScope();
container.bind<IAuditRepository>(TYPES.IAuditRepository).to(AuditPrmRepo).inRequestScope();


//Service
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inRequestScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inRequestScope();
container.bind<IAuditService>(TYPES.IAuditService).to(AuditService).inRequestScope();


// Util
container.bind<IHasher>(TYPES.IHasher).to(Hasher);
container.bind<IJwtProvider>(TYPES.IJwtProvider).to(jwtProvider);
container.bind<IPubSub>(TYPES.IPubSub).to(LocalPubSub).inSingletonScope().onActivation( (r ,p )=> {
    if( p instanceof LocalPubSub)  p.Serve().then(r => r );
    return p;
});
container.bind<IAppContext>(TYPES.IAppContext).to(AppContext).inSingletonScope();

export { container };