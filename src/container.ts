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
import {ISkuAttrRepository} from "./modules/catalog/sku-attr/repository/ISkuAttrRepository";
import {SkuAttrMysqlRepo} from "./modules/catalog/sku-attr/repository/skuAttrMysqlRepo";
import {ISkuAttrService} from "./modules/catalog/sku-attr/service/ISkuAttrService";
import {SkuAttrService} from "./modules/catalog/sku-attr/service/skuAttrService";
import {BrandMysqlRepo} from "./modules/catalog/brand/repository/BrandMysqlRepo";
import {IBrandRepository} from "./modules/catalog/brand/repository/IBrandRepository";
import {IBrandService} from "./modules/catalog/brand/service/IBrandService";
import {BrandService} from "./modules/catalog/brand/service/BrandService";
import {ISkuRepository} from "./modules/catalog/sku/repository/ISkuRepository";
import {SkuMysqlRepo} from "./modules/catalog/sku/repository/skuMysqlRepo";
import {ISkuService} from "./modules/catalog/sku/service/ISkuService";
import {SkuService} from "./modules/catalog/sku/service/skuService";
import {OrderMysqlRepo} from "./modules/order/order/repository/OrderMysqlRepo";
import {IOrderRepository} from "./modules/order/order/repository/IOrderRepository";
import {OrderService} from "./modules/order/order/service/OrderService";
import {IOrderService} from "./modules/order/order/service/IOrderService";

import {IInventoryReportRepository} from "./modules/inventory/repository/IInventoryReportRepository";
import {InventoryReportMysqlRepo} from "./modules/inventory/repository/implemention/inventoryReportMysqlRepo";
import {IInventoryReportService} from "./modules/inventory/service/IInventoryReportService";
import {InventoryReportService} from "./modules/inventory/service/inventoryReportService";

import {
    ISkuWholesalePriceRepository
} from "./modules/catalog/sku-wholesale-prices/repository/ISkuWholesalePriceRepository";
import {SkuWholesalePriceMysqlRepo} from "./modules/catalog/sku-wholesale-prices/repository/SkuWholesalePriceMysqlRepo";
import {ISkuWholesalePriceService} from "./modules/catalog/sku-wholesale-prices/service/ISkuWholesalePriceService";
import {SkuWholesalePriceService} from "./modules/catalog/sku-wholesale-prices/service/SkuWholesalePriceService";
import {IUploadProvider} from "./components/uploadProvider/IUploadProvider";
import {S3Provider} from "./components/uploadProvider/s3Provider";
import {IUploadService} from "./modules/upload/service/IUploadService";
import {UploadService} from "./modules/upload/service/uploadService";


import {ICustomerRepository} from "./modules/customer/repo/ICustomerRepository";
import {CustomerService} from "./modules/customer/service/CustomerService";
import {ICustomerService} from "./modules/customer/service/ICustomerService";
import {CustomerMysqlRepo} from "./modules/customer/repo/CustomerMysqlRepo";

import {IProviderRepository} from "./modules/provider/repository/IProviderRepository";
import {ProviderMySqlRepo} from "./modules/provider/repository/providerMySqlRepo";
import {IProviderService} from "./modules/provider/service/IProviderService";
import {ProviderService} from "./modules/provider/service/providerService";

import {IStockInRepository} from "./modules/stock/stockIn/repository/IStockInRepository";
import {StockInRepository} from "./modules/stock/stockIn/repository/StockInRepository";
import {IStockInService} from "./modules/stock/stockIn/service/IStockInService";
import {StockInService} from "./modules/stock/stockIn/service/StockInService";

import {OrderItemMysqlRepo} from "./modules/order/order-item/repository/OrderItemMysqlRepo";
import {IOrderItemRepository} from "./modules/order/order-item/repository/IOrderItemRepository";
import {IOrderItemService} from "./modules/order/order-item/service/IOrderItemService";
import {OrderItemService} from "./modules/order/order-item/service/OrderItemService";



dotenv.config();

const container = new Container();
//Repository
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthMysqlRepo).inRequestScope();
// container.bind<IUserLocalRepository>(TYPES.IUserLocalRepository).to(UserLocal).inRequestScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserMysqlRepo).inRequestScope();
container.bind<IAuditRepository>(TYPES.IAuditRepository).to(AuditMysqlRepo).inRequestScope();
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryMysqlRepo).inRequestScope();
container.bind<ISpuRepository>(TYPES.ISpuRepository).to(SpuMysqlRepo).inRequestScope();
container.bind<ISkuAttrRepository>(TYPES.ISkuAttrRepository).to(SkuAttrMysqlRepo).inRequestScope();
container.bind<IBrandRepository>(TYPES.IBrandRepository).to(BrandMysqlRepo).inRequestScope();
container.bind<ISkuRepository>(TYPES.ISkuRepository).to(SkuMysqlRepo).inRequestScope();
container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderMysqlRepo).inRequestScope();
container.bind<IOrderItemRepository>(TYPES.IOrderItemRepository).to(OrderItemMysqlRepo).inRequestScope();
container.bind<IInventoryReportRepository>(TYPES.IInventoryReportRepository).to(InventoryReportMysqlRepo).inRequestScope();

container.bind<ISkuWholesalePriceRepository>(TYPES.ISkuWholesalePriceRepository).to(SkuWholesalePriceMysqlRepo).inRequestScope();

container.bind<ICustomerRepository>(TYPES.ICustomerRepository).to(CustomerMysqlRepo).inRequestScope();
container.bind<IProviderRepository>(TYPES.IProviderRepository).to(ProviderMySqlRepo).inRequestScope();
container.bind<IStockInRepository>(TYPES.IStockInRepository).to(StockInRepository).inRequestScope();


//Service
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inRequestScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inRequestScope();
container.bind<IAuditService>(TYPES.IAuditService).to(AuditService).inRequestScope();
container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inRequestScope();
container.bind<ISpuService>(TYPES.ISpuService).to(SpuService).inRequestScope();
container.bind<ISkuAttrService>(TYPES.ISkuAttrService).to(SkuAttrService).inRequestScope();
container.bind<IBrandService>(TYPES.IBrandService).to(BrandService).inRequestScope();
container.bind<ISkuService>(TYPES.ISkuService).to(SkuService).inRequestScope();
container.bind<IOrderService>(TYPES.IOrderService).to(OrderService).inRequestScope();
container.bind<IOrderItemService>(TYPES.IOrderItemService).to(OrderItemService).inRequestScope();

container.bind<ISkuWholesalePriceService>(TYPES.ISkuWholesalePriceService).to(SkuWholesalePriceService).inRequestScope();
container.bind<IUploadService>(TYPES.IUploadService).to(UploadService).inRequestScope();


container.bind<IProviderService>(TYPES.IProviderService).to(ProviderService).inRequestScope();
container.bind<IStockInService>(TYPES.IStockInService).to(StockInService).inRequestScope();

container.bind<IInventoryReportService>(TYPES.IInventoryReportService).to(InventoryReportService).inRequestScope();
container.bind<ICustomerService>(TYPES.ICustomerService).to(CustomerService).inRequestScope();

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
container.bind<IUploadProvider>(TYPES.IUploadProvider).toConstantValue(new S3Provider(process.env.BUCKET_NAME || "" , process.env.CLOUDFRONT_URL || ""));

export {container};