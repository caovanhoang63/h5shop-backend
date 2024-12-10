import {IPubSub} from "../pubsub";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";

export interface IAppContext {
    // GetDbConnectionPool: () => implemention.Pool;
    GetPubsub: () => IPubSub
}


@injectable()
export class AppContext implements IAppContext {
    // private readonly connectionPool: implemention.Pool;
    private readonly ps: IPubSub;

    constructor(@inject(TYPES.IPubSub) ps: IPubSub) {
        // this.connectionPool = connectionPool;
        this.ps = ps;
    }

    public GetPubsub = () => {
        return this.ps;
    };

    // public GetDbConnectionPool = (): implemention.Pool => {
    //     // return this.connectionPool
    // };


}