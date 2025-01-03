import {

    topicCreateCategory, topicCreateCustomer, topicCreateInventory, topicCreateSpu, topicCreateStockIn,
    topicDeleteCategory, topicDeleteCustomer, topicDeleteSpu,
    topicDeleteUser, topicPayOrder,
    topicRegister,
    topicUpdateCategory, topicUpdateCustomer, topicUpdateSpu

} from "./libs/topics";
import {SubscriberEngine} from "./components/subcriber";
import {AuditSubscribeHandler} from "./modules/audit/transport/subcriber";
import {container} from "./container";
import {IAuditService} from "./modules/audit/service/IAuditService";
import {TYPES} from "./types";
import {UserSubscriberHandler} from "./modules/user/transport/subcriber";
import {IUserService} from "./modules/user/service/IUserService";

import {IStockInService} from "./modules/stock/stockIn/service/IStockInService";
import {StockInSubscriberHandler} from "./modules/stock/stockIn/transport/subcriber"
import {SkuSubscriberHandler} from "./modules/catalog/sku/transport/subsciber";
import {ISkuService} from "./modules/catalog/sku/service/ISkuService";

import {CustomerSubCribeHandler} from "./modules/customer/transport/customerSub";
import {ICustomerService} from "./modules/customer/service/ICustomerService";



const subscriberEngine = new SubscriberEngine();

const audit = new AuditSubscribeHandler(container.get<IAuditService>(TYPES.IAuditService))
const user = new UserSubscriberHandler(container.get<IUserService>(TYPES.IUserService))

const stockIn = new StockInSubscriberHandler(container.get<IStockInService>(TYPES.IStockInService))
const sku = new SkuSubscriberHandler(container.get<ISkuService>(TYPES.ISkuService))

const customer = new CustomerSubCribeHandler(container.get<ICustomerService>(TYPES.ICustomerService))



subscriberEngine.subscribe(topicRegister, audit.onCreate("auth"));

subscriberEngine.subscribe(topicCreateCategory, audit.onCreate("category"));
subscriberEngine.subscribe(topicUpdateCategory, audit.onUpdate("category"));
subscriberEngine.subscribe(topicDeleteCategory, audit.onDelete("category"));


subscriberEngine.subscribe(topicCreateSpu, audit.onCreate("spu"));
subscriberEngine.subscribe(topicUpdateSpu, audit.onUpdate("spu"));
subscriberEngine.subscribe(topicDeleteSpu, audit.onDelete("spu"));

subscriberEngine.subscribe(topicDeleteUser, user.onHardDelete());
subscriberEngine.subscribe(topicPayOrder,audit.onPayOrder(), customer.onPaymentSuccess());

subscriberEngine.subscribe(topicCreateCustomer, audit.onCreate("customer"));
subscriberEngine.subscribe(topicUpdateCustomer, audit.onUpdate("customer"));
subscriberEngine.subscribe(topicDeleteCustomer, audit.onDelete("customer"));

subscriberEngine.subscribe(topicCreateStockIn, sku.onUpdate())

export default subscriberEngine