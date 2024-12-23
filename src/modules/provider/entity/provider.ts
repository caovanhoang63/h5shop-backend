export interface Provider{
    id: number;
    name: string;
    address: string;
    email: string,
    phone_number: string,
    debt: number,
    status : number,
    createdAt : Date | null;
    updatedAt : Date | null;
}