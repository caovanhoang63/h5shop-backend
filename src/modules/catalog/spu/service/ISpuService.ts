import {IRequester} from "../../../../libs/IRequester";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {SpuCreate} from "../entity/spuCreate";
import {Spu} from "../entity/spu";
import {SpuUpdate} from "../entity/spuUpdate";
import {SpuDetailUpsert} from "../entity/spuDetailUpsert";
import {SpuDetail} from "../entity/spuDetail";
import {SpuFilter} from "../entity/spuFilterSchema";

export interface ISpuService  {
    create(requester : IRequester,c : SpuCreate): ResultAsync<void, Err>
    update(requester : IRequester,id : number,c : SpuUpdate): ResultAsync<void, Err>
    delete(requester : IRequester,id : number): ResultAsync<void, Err>
    list(cond : SpuFilter, paging : Paging): ResultAsync<Spu[] | null , Err>
    findById(id : number): ResultAsync<Spu | null, Err>
    upsertSpuDetail(requester : IRequester, c: SpuDetailUpsert): ResultAsync<void, Err>
    getDetail(id: number): ResultAsync<SpuDetail | null, Err>
}