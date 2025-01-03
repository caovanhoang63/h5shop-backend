import {IBaseRepo} from "../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {Err} from "../../../libs/errors";
import {Employee, EmployeeCreate, EmployeeUpdate} from "../entity/employee";

export interface IEmployeeRepository extends IBaseRepo {
    create: (employeeCreate: EmployeeCreate) => ResultAsync<void, Error>
    update: (id:number,employeeUpdate: EmployeeUpdate)=> ResultAsync<void, Error>
    delete: (id:number)=> ResultAsync<void, Error>
    list(cond : ICondition, paging : Paging): ResultAsync<Employee[] | null , Err>
    findById: (id:number)=> ResultAsync<Employee | null, Err>
}