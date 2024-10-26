type Topic = string;

type Message = {
    data: any;
}

interface IPubSub {
    Publish: (topic: Topic, message: Message) => void;
    Subscribe: (topic: Topic) => Message[];
}


