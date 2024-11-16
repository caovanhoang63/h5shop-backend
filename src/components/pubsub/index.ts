import {AppError} from "../../libs/errors";
import {ResultAsync} from "neverthrow";

export type Topic = string;

export type Message = {
    id: string;
    data: any;
    topic: Topic;
}

export interface IPubSub {
    Publish: (topic: Topic, message: Message) =>  ResultAsync<void,AppError>;
    Subscribe: (topic: Topic) =>  ResultAsync<[Message[],() => void],AppError> ;
}


