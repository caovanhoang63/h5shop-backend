import {topicRegister} from "./libs/topics";
import {SubscriberEngine} from "./components/subcriber";
import {AuditSubscribeHandler} from "./modules/audit/transport/subcriber";
import {container} from "./container";
import {IAuditService} from "./modules/audit/service/IAuditService";
import {TYPES} from "./types";


const subscriberEngine = new SubscriberEngine();



const audit = new AuditSubscribeHandler(container.get<IAuditService>(TYPES.IAuditService))
subscriberEngine.subscribe(topicRegister,audit.onRegister());


export default subscriberEngine