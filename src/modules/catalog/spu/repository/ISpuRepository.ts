import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SpuCreate} from "../entity/spuCreate";
import {SpuUpdate} from "../entity/spuUpdate";
import {Spu} from "../entity/spu";
import {SpuDetailUpsert} from "../entity/spuDetailUpsert";
import {SpuDetail} from "../entity/spuDetail";

export interface ISpuRepository extends IBaseRepo {
    create(c : SpuCreate): ResultAsync<void, Err>
    update(id : number,c : SpuUpdate): ResultAsync<void, Err>
    delete(id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Spu[] | null , Err>
    findById(id : number): ResultAsync<Spu | null, Err>
    upsert(c: SpuCreate): ResultAsync<number, Err>
    getDetail(id: number): ResultAsync<SpuDetail | null, Err>
}