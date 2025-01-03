import {IEmployeeService} from "./modules/employee/service/IEmployeeService";

const TYPES = {
    // REPOSITORY
    IAuthRepository: Symbol.for("IAuthRepository"),
    IUserLocalRepository: Symbol.for("IUserLocalRepository"),
    IUserRepository: Symbol.for("IUserRepository"),
    IAuditRepository: Symbol.for("IAuditRepository"),
    ICategoryRepository: Symbol.for("ICategoryRepository"),
    ISpuRepository: Symbol.for("ISpuRepository"),
    ISkuAttrRepository: Symbol.for("ISkuAttrRepository"),
    IBrandRepository: Symbol.for("IBrandRepository"),
    ISkuRepository: Symbol.for("ISkuRepository"),
    IOrderRepository: Symbol.for("IOrderRepository"),
    IOrderItemRepository: Symbol.for("IOrderItemRepository"),
    IInventoryReportRepository: Symbol.for("IInventoryReportRepository"),

    ISkuWholesalePriceRepository: Symbol.for("ISkuWholesalePriceRepository"),

    ICustomerRepository: Symbol.for("ICustomerRepository"),
    IProviderRepository: Symbol.for("IProviderRepository"),
    IEmployeeRepository: Symbol.for("IEmployeeRepository"),
    IStockInRepository: Symbol.for("IStockInRepository"),
    IStockOutRepository: Symbol.for("IStockOutRepository"),

    IWarrantyRepository: Symbol.for("IWarrantyRepository"),
    ISettingRepository: Symbol.for("ISettingRepository"),
    IReportRepository : Symbol.for("IReportRepository"),

    // SERVICE
    IAuthService: Symbol.for("IAuthService"),
    IUserService: Symbol.for("IUserService"),
    IAuditService: Symbol.for("IAuditService"),
    ICategoryService: Symbol.for("ICategoryService"),
    ISpuService: Symbol.for("ISpuService"),
    ISkuAttrService: Symbol.for("ISkuAttrService"),
    IBrandService: Symbol.for("IBrandService"),
    ISkuService: Symbol.for("ISkuService"),
    IOrderService: Symbol.for("IOrderService"),
    IOrderItemService: Symbol.for("IOrderItemService"),
    ISettingService: Symbol.for("ISettingService"),
    IReportService : Symbol.for("IReportService"),


    ISkuWholesalePriceService: Symbol.for("ISkuWholesalePriceService"),
    IUploadService: Symbol.for("IUploadService"),

    IProviderService: Symbol.for("IProviderService"),
    IEmployeeService: Symbol.for("IEmployeeService"),
    IStockInService: Symbol.for("IStockInService"),
    IStockOutService: Symbol.for("IStockOutService"),


    IInventoryReportService: Symbol.for("IInventoryReportService"),
    ICustomerService: Symbol.for("ICustomerService"),

    IWarrantyService: Symbol.for("IWarrantyService"),
    //Controller
    IWarrantyController: Symbol.for("IWarrantyController"),
    ISettingController: Symbol.for("ISettingController"),
    IReportController: Symbol.for("IReportController"),
    // UTILS
    IHasher: Symbol.for("IHasher"),
    IJwtProvider: Symbol.for("IJwtProvider"),
    IPubSub: Symbol.for("IPubSub"),
    IAppContext: Symbol.for("IAppContext"),
    IConnectionPool: Symbol.for("IConnectionPool"),
    ConnPool: Symbol.for("ConnPool"),
    IUploadProvider: Symbol.for("IUploadProvider"),
};
export {TYPES};