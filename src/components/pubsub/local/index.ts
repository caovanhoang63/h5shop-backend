import {Mutex} from "async-mutex";
import {IPubSub, Message, Topic} from "../index";
import EventEmitter from "node:events";
import {Err} from "../../../libs/errors";
import {ok, ResultAsync} from "neverthrow";
import {injectable} from "inversify";

interface IQueueMap {
    [topic: string]: Message[][];
}

@injectable()
export class LocalPubSub implements IPubSub {
    private readonly messageEmitter: EventEmitter;
    private readonly channelMap: IQueueMap = {};
    private readonly messageQueue: Message[] = [];
    private readonly lock = new Mutex();
    private isServing = false;

    constructor() {
        this.messageEmitter = new EventEmitter();
        this.messageEmitter.on('newMessage', this.processMessage.bind(this));
    }

    private async processMessage() {
        if (this.messageQueue.length > 0) {
            const release = await this.lock.acquire();
            try {
                const message = this.messageQueue.shift();
                if (message) {
                    const topic = message.topic;
                    if (this.channelMap[topic]) {
                        for (const queue of this.channelMap[topic]) {
                            queue.push(message);
                        }
                    }
                }
            } finally {
                release();
            }
        }
    }

    public Serve(): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                if (!this.isServing) {
                    this.isServing = true;
                    console.log("Local pubsub started!");
                }
                // This promise never resolves, keeping the service running
                return new Promise<never>(() => {
                });
            })(),
            e => e as Err,
        ).andThen(r => r);
    }

    public Publish(topic: Topic, message: Message): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                console.log("Publish", message.id)
                const release = await this.lock.acquire();
                try {
                    message.topic = topic;
                    this.messageQueue.push(message);
                    this.messageEmitter.emit('newMessage');
                } finally {
                    release();
                }
                return ok(undefined);
            })(),
            e => e as Err
        ).andThen(r => r);
    }

    public Subscribe(topic: Topic): ResultAsync<[Message[], () => void], Err> {
        const messages: Message[] = [];
        return ResultAsync.fromPromise(
            (async () => {
                const release = await this.lock.acquire();
                try {
                    if (!this.channelMap[topic]) {
                        this.channelMap[topic] = [];
                    }
                    this.channelMap[topic].push(messages);
                } finally {
                    release();
                }

                return ok<[Message[], () => void]>([
                    messages,
                    async () => {
                        const release = await this.lock.acquire();
                        try {
                            if (this.channelMap[topic]) {
                                const index = this.channelMap[topic].indexOf(messages);
                                if (index !== -1) {
                                    this.channelMap[topic].splice(index, 1);
                                }
                            }
                        } finally {
                            release();
                        }
                    }
                ]);
            })(),
            e => e as Err
        ).andThen(r => r);
    }
}