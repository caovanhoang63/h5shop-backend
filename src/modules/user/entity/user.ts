import {BaseModel} from "../../../libs/baseModel";

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}


export enum SystemRole {
    Admin = 'admin',
    Owner = 'owner',
    SaleStaff = 'sale_staff',
    WarehouseStaff = 'warehouse_staff',
    TechnicalStaff = 'technical_staff',
    FinanceStaff = 'finance_staff',
}

export interface User extends BaseModel{
    phoneNumber?: number;
    email?: string;
    address?: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: Gender;
    systemRole: SystemRole;
    status: number;
}

const user: User = {
    id : 1,
    createdAt: new Date,
    updatedAt: new Date,
    firstName : "cao",
    lastName : "asd",
    status : 1,
    systemRole : SystemRole.Admin
}

