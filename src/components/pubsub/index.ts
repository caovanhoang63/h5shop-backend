import {Err} from "../../libs/errors";
import {ResultAsync} from "neverthrow";
import {randomUUID} from "node:crypto";
import {IRequester} from "../../libs/IRequester";

export type Topic = string;

export type Message = {
    id: string;
    data: any;
    topic: Topic;
}

export function createMessage(data : any,requester? : IRequester)  : Message {
    return {
        data:{
            requester: requester,
            data: data
        },
        id: randomUUID(),
        topic: "",
    }
}

export interface IPubSub {
    Publish: (topic: Topic, message: Message) => ResultAsync<void, Err>;
    Subscribe: (topic: Topic) => ResultAsync<[Message[], () => void], Err>;
}
