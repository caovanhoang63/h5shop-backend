import {IRequester} from "../../../../libs/IRequester";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SpuCreate} from "../entity/spuCreate";
import {Spu} from "../entity/spu";

export interface ISpuService  {
    create(requester : IRequester,c : SpuCreate): ResultAsync<void, Err>
    update(requester : IRequester,id : number,c : SpuCreate): ResultAsync<void, Err>
    delete(requester : IRequester,id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Spu[] | null , Err>
    findById(id : number): ResultAsync<Spu | null, Err>
}