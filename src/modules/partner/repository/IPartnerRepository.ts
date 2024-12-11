import {IBaseRepo} from "../../../libs/IBaseRepo";
import {PartnerCreate} from "../entity/partnerCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {Partner} from "../entity/partner";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";

export default interface IPartnerRepository extends IBaseRepo {
    create(c: PartnerCreate): ResultAsync<void, Err>

    update(id: number, c: PartnerCreate): ResultAsync<void, Err>

    delete(id: number): ResultAsync<void, Err>

    list(cond: ICondition, paging: Paging): ResultAsync<Partner[] | null, Err>

    findById(id: number): ResultAsync<Partner | null, Err>
}