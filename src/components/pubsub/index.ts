import {ResultAsync} from "../../libs/resultAsync";

export type Topic = string;

export type Message = {
    id: string;
    data: any;
    topic: Topic;
}

export interface IPubSub {
    Publish: (topic: Topic, message: Message) =>  ResultAsync<never>;
    Subscribe: (topic: Topic) =>  ResultAsync<[Message[],() => void]> ;
}


