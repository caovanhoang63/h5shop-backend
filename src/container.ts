import 'reflect-metadata';
import {Container} from 'inversify';
import {TYPES} from "./types";
import {IAuthRepository} from "./modules/auth/repository/IAuthRepository";
import {AuthService, IHasher} from "./modules/auth/service/implementation/authService";
import {Hasher} from "./libs/hasher";
import {IJwtProvider, jwtProvider} from "./components/jwtProvider/IJwtProvider";
import {IAuthService} from "./modules/auth/service/interface/IAuthService";
import {IUserService} from "./modules/user/service/IUserService";
import {UserService} from "./modules/user/service/userService";
import {IUserRepository} from "./modules/user/repository/IUserRepository";
import {IPubSub} from "./components/pubsub";
import {LocalPubSub} from "./components/pubsub/local";
import {IAuditService} from "./modules/audit/service/IAuditService";
import {AuditService} from "./modules/audit/service/auditService";
import {IAuditRepository} from "./modules/audit/repository/IAuditRepository";
import {AppContext, IAppContext} from "./components/appContext/appContext";
import {AuthMysqlRepo} from "./modules/auth/repository/implementation/mysqlRepo";
import {UserMysqlRepo} from "./modules/user/repository/implementation/mysqlRepo";
import {AuditMysqlRepo} from "./modules/audit/repository/auditMysqlRepo";
import {IConnectionPool, MysqlConnectionPool} from "./components/mysql/MysqlConnectionPool";
import {Pool} from "mysql2/typings/mysql/lib/Pool";
import mysql from "mysql2";
import dotenv from "dotenv";
import {ICategoryRepository} from "./modules/catalog/category/repository/ICategoryRepository";
import {CategoryMysqlRepo} from "./modules/catalog/category/repository/CategoryMysqlRepo";
import {ICategoryService} from "./modules/catalog/category/service/ICategoryService";
import {CategoryService} from "./modules/catalog/category/service/categoryService";
import {ISpuRepository} from "./modules/catalog/spu/repository/ISpuRepository";
import {SpuMysqlRepo} from "./modules/catalog/spu/repository/spuMysqlRepo";
import {ISpuService} from "./modules/catalog/spu/service/ISpuService";
import {SpuService} from "./modules/catalog/spu/service/spuService";

dotenv.config();

const container = new Container();
//Repository
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthMysqlRepo).inRequestScope();
// container.bind<IUserLocalRepository>(TYPES.IUserLocalRepository).to(UserLocal).inRequestScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserMysqlRepo).inRequestScope();
container.bind<IAuditRepository>(TYPES.IAuditRepository).to(AuditMysqlRepo).inRequestScope();
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryMysqlRepo).inRequestScope();
container.bind<ISpuRepository>(TYPES.ISpuRepository).to(SpuMysqlRepo).inRequestScope();


//Service
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inRequestScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inRequestScope();
container.bind<IAuditService>(TYPES.IAuditService).to(AuditService).inRequestScope();
container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inRequestScope();
container.bind<ISpuService>(TYPES.ISpuService).to(SpuService).inRequestScope();


// Util
container.bind<Pool>(TYPES.ConnPool).toConstantValue(mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}));
container.bind<IHasher>(TYPES.IHasher).to(Hasher);
container.bind<IJwtProvider>(TYPES.IJwtProvider).to(jwtProvider);
container.bind<IPubSub>(TYPES.IPubSub).to(LocalPubSub).inSingletonScope().onActivation((r, p) => {
    if (p instanceof LocalPubSub) p.Serve().then(r => r);
    return p;
});
container.bind<IAppContext>(TYPES.IAppContext).to(AppContext).inSingletonScope();
container.bind<IConnectionPool>(TYPES.IConnectionPool).to(MysqlConnectionPool).inSingletonScope();

export {container};