import {ResultAsync} from "../../../libs/resultAsync";
import {Ok} from "../../../libs/result";
import {Mutex} from "async-mutex";
import {IPubSub, Message, Topic} from "../index";
import EventEmitter from "node:events";

interface IQueueMap  {
    [topic: string]: Message[][];
}

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

    public Serve(): ResultAsync<never> {
        return ResultAsync.fromPromise(
            (async () => {
                if (!this.isServing) {
                    this.isServing = true;
                    console.log("Local pubsub started!");
                }
                // This promise never resolves, keeping the service running
                return new Promise<never>(() => {});
            })()
        );
    }

    public Publish(topic: Topic, message: Message): ResultAsync<never> {
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
                return Ok();
            })()
        );
    }

    public Subscribe(topic: Topic): ResultAsync<[Message[], () => void]> {
        const messages: Message[] = [];
        return ResultAsync.fromPromise(
            (async () => {
                console.log("Subscribe", topic);
                const release = await this.lock.acquire();
                try {
                    if (!this.channelMap[topic]) {
                        this.channelMap[topic] = [];
                    }
                    this.channelMap[topic].push(messages);
                } finally {
                    release();
                }

                return Ok<[Message[], () => void]>([
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
            })()
        );
    }
}