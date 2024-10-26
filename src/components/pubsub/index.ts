type Topic = string;

type Message = {
    id: string;
    data: any;
    topic: Topic;
}

interface IPubSub {
    Publish: (topic: Topic, message: Message) => void;
    Subscribe: (topic: Topic) => Message[];
}


