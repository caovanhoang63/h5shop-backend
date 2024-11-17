import {IAppContext} from "../components/appContext/appContext";
import {Message, Topic} from "../components/pubsub";
import EventEmitter from "node:events";
import {TopicTest} from "../libs/topics";
import {createInternalError, Err,} from "../libs/errors";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {forEach} from "lodash";

//TODO:  Implement retry feature
type Handler = (m: Message) => ResultAsync<void, Err>;

export class SubscriberEngine {
    private readonly subscribers: Map<Topic, {
        messages: Message[],
        handler: Handler[],
        emitter: EventEmitter,
        cleanup: () => void
    }[]> = new Map();

    constructor(private readonly appContext: IAppContext) {}

    run(): ResultAsync<never, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                // The run method now just ensures the engine is ready
                // and returns a never-resolving promise to keep the service running
                console.log("Subscriber engine started!");



                return new Promise<never>(() => {});

            })(), e => e as Err
        ).andThen(r => r);
    }

    public subscribe = (topic: Topic, ...handler: Handler[]): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.startSubTopic(topic, ...handler);
                return okAsync(undefined)
            })(), e => e as Err
        ).andThen(r => r)
    }

    private startSubTopic = (topic: Topic, ...handlers: Handler[]): ResultAsync<() => void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                // Subscribe to the topic
                const subscribeResult = await this.appContext.GetPubsub().Subscribe(topic);
                if (subscribeResult.isErr()) {
                    return errAsync(subscribeResult.error)
                }
                const [messages, unsubscribe] = subscribeResult.value;

                // Create an event emitter for this subscription
                const emitter = new EventEmitter();

                // Set up the message handler
                const processMessage = () => {
                    while (messages.length > 0) {
                        const message = messages.shift()!;
                        try {
                            for (const handler of handlers) {
                                handler(message);
                            }
                        } catch (error) {
                            console.error(`Error processing message for topic ${topic}:`, error);
                        }
                    }
                };

                // Set up the message processing listener
                emitter.on('newMessage', processMessage);

                // Set up a watcher that checks for new messages
                const checkInterval = setInterval(() => {
                    if (messages.length > 0) {
                        emitter.emit('newMessage');
                    }
                }, 10); // Check every 10ms

                // Store subscriber information
                if (!this.subscribers.has(topic)) {
                    this.subscribers.set(topic, []);
                }

                const subscriberInfo = {
                    messages,
                    handler: handlers,
                    emitter,
                    cleanup: unsubscribe
                };

                this.subscribers.get(topic)!.push(subscriberInfo);

                // Return cleanup function
                return okAsync(() => {
                    clearInterval(checkInterval);
                    emitter.removeAllListeners();
                    unsubscribe();

                    // Remove from subscribers map
                    const subs = this.subscribers.get(topic);
                    if (subs) {
                        const index = subs.indexOf(subscriberInfo);
                        if (index !== -1) {
                            subs.splice(index, 1);
                        }
                        if (subs.length === 0) {
                            this.subscribers.delete(topic);
                        }
                    }
                });
            })(), e => createInternalError(e)
        ).andThen(r => r);
    }

    // Method to get current subscribers count for a topic
    public getSubscribersCount(topic: Topic): number {
        return this.subscribers.get(topic)?.length || 0;
    }

    // Method to clean up all subscriptions
    public cleanup(): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                for (const [topic, subs] of this.subscribers) {
                    for (const sub of subs) {
                        sub.cleanup();
                    }
                }
                this.subscribers.clear();
                return okAsync(undefined);
            })(),
            e => createInternalError(e)
        ).andThen(r => r);
    }
}
