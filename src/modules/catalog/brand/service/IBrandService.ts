import {Err} from "../../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {BrandCreate} from "../entity/brandCreate";
import {IRequester} from "../../../../libs/IRequester";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {Brand} from "../entity/brand";
import {BrandUpdate} from "../entity/brandUpdate";

export interface IBrandService {
    create(requester: IRequester, c: BrandCreate): ResultAsync<void, Err>
    update(requester: IRequester, id: number, c: BrandUpdate): ResultAsync<void, Err>
    delete(requester: IRequester, id: number): ResultAsync<void, Err>
    list(cond: ICondition, paging: Paging): ResultAsync<Brand[] | null, Err>
    findById(id: number): ResultAsync<BrandCreate | null, Err>
}