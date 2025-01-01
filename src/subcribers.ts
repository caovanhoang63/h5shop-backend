import {
    topicCreateCategory, topicCreateSpu,
    topicDeleteCategory, topicDeleteSpu,
    topicDeleteUser, topicPayOrder,
    topicRegister,
    topicUpdateCategory, topicUpdateSpu
} from "./libs/topics";
import {SubscriberEngine} from "./components/subcriber";
import {AuditSubscribeHandler} from "./modules/audit/transport/subcriber";
import {container} from "./container";
import {IAuditService} from "./modules/audit/service/IAuditService";
import {TYPES} from "./types";
import {UserSubscriberHandler} from "./modules/user/transport/subcriber";
import {IUserService} from "./modules/user/service/IUserService";
import {CustomerSubCribeHandler} from "./modules/customer/transport/customerSub";
import {ICustomerService} from "./modules/customer/service/ICustomerService";


const subscriberEngine = new SubscriberEngine();

const audit = new AuditSubscribeHandler(container.get<IAuditService>(TYPES.IAuditService))
const user = new UserSubscriberHandler(container.get<IUserService>(TYPES.IUserService))
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


export default subscriberEngine