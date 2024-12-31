
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
    IInventoryReportRepository: Symbol.for("IInventoryReportRepository"),

    ISkuWholesalePriceRepository: Symbol.for("ISkuWholesalePriceRepository"),

    ICustomerRepository: Symbol.for("ICustomerRepository"),
    IProviderRepository: Symbol.for("IProviderRepository"),
    IStockInRepository: Symbol.for("IStockInRepository"),


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

    ISkuWholesalePriceService: Symbol.for("ISkuWholesalePriceService"),
    IUploadService: Symbol.for("IUploadService"),

    IProviderService: Symbol.for("IProviderService"),
    IStockInService: Symbol.for("IStockInService"),


    IInventoryReportService: Symbol.for("IInventoryReportService"),
    ICustomerService: Symbol.for("ICustomerService"),
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