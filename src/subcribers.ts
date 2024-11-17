import {TopicTest} from "./libs/topics";
import {Message} from "./components/pubsub";
import {okAsync, ResultAsync} from "neverthrow";
import {Err} from "./libs/errors";
import {SubscriberEngine} from "./components/subcriber";


const subscriberEngine = new SubscriberEngine();

subscriberEngine.subscribe(TopicTest + "1",
    (m: Message): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                console.log("Subcriber423")
                return okAsync(undefined)
            })(), e => e as Err
        ).andThen(r => r)},
    (m: Message): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                console.log("Subcriber123")
                return okAsync(undefined)
            })(), e => e as Err
        ).andThen(r => r)});





export default subscriberEngine