import {BaseModel} from "../../../libs/baseModel";
import {Nullable} from "../../../libs/nullable";
import {UserGender, UserSystemRole} from "@prisma/client";

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

export interface User  {
    id: number;
    phoneNumber: string |null;
    email: string | null;
    address: string | null;
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
    gender: UserGender | null;
    systemRole: UserSystemRole |null;
    status: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}



