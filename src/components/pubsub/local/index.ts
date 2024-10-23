// interface IQueueMap  {
//     [topic: string]: Message[][];
// }
//
// class LocalPubSub implements IPubSub {
//     constructor() {
//         this.data = new class implements IQueueMap {
//             [topic: string]: Message[];
//         }
//     }
//
//     private readonly data : IQueueMap ;
//
//     public Serve() {
//
//     }
//
//     public Publish(topic : Topic ,message : Message) {
//         if (!this.data[topic])  {
//             this.data[topic] = [];
//         }
//         this.data[topic].push(message);
//     }
//
//     public Subscribe(topic : Topic)  {
//
//         return []
//     }
// }