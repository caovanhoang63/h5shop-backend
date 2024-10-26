import {ResultAsync} from "../../../libs/resultAsync";
import {Ok, Result} from "../../../libs/result";
import {Mutex} from "async-mutex";
import mutex from "../../mutex";
import {fill} from "lodash";

interface IQueueMap  {
    [topic: string]: Message[][];
}

class LocalPubSub {
    constructor() {
        this.channelMap = {}

    }
    private readonly channelMap : IQueueMap ;
    private readonly messageQueue: Message[] = [];
    private readonly lock = new Mutex();
    public Serve() : ResultAsync<never>  {
        return ResultAsync.fromPromise(
            (async () => {
                console.log("Local pubsub started!")
                while (true) {
                    if (this.messageQueue.length > 0) {
                        const release = await this.lock.acquire();
                        try {
                            const message = this.messageQueue.shift()
                            const topic = message!.topic
                            if (this.channelMap[topic]) {
                                for (let i = 0; i < this.channelMap[topic].length; i++ ){
                                    this.channelMap[topic][i].push(message!)
                                }
                            }
                        } finally {
                            release()
                        }
                    }
                }
            })()
        )
    }
    public  Publish(topic : Topic ,message : Message) : ResultAsync<never> {
        return ResultAsync.fromPromise(
            (async () => {
                const release = await this.lock.acquire();
                try {
                    message.topic = topic;
                    //Push to the push
                    this.messageQueue.push(message);
                } finally {
                    release();
                }
                return Ok<never>()
            })()
        )
    }

    public Subscribe(topic : Topic) :  ResultAsync<[Message[],() => void]> {
        const messages : Message[] = []
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

                return Ok<[Message[],() => void]>(
                    [messages, async () => {
                        const release = await this.lock.acquire();
                        try {
                            if (this.channelMap[topic]) {
                                for( let i = 0; i < this.channelMap[topic].length; i++ ){
                                    if (messages === this.channelMap[topic][i]) {
                                        this.channelMap[topic].splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        } finally {
                            release();
                        }
                    }]
                )
            })()
        )

    }
}