import {IRequester} from "../../../libs/IRequester";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {Employee, EmployeeCreate, EmployeeUpdate} from "../entity/employee";

export interface IEmployeeService{
    create(requester: IRequester, c: EmployeeCreate): ResultAsync<void, Err>
    update(requester: IRequester, id: number, c: EmployeeUpdate): ResultAsync<void, Err>
    delete(requester: IRequester, id: number): ResultAsync<void, Err>
    list(cond: ICondition, paging: Paging): ResultAsync<Employee[] | null, Err>
    findById(id: number): ResultAsync<Employee | null, Err>
}