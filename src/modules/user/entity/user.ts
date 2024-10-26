import {BaseModel} from "../../../libs/baseModel";

export const UserEntityName = "User";

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

export interface User extends BaseModel {
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

