export interface StockOutTable {
    id: number;
    warehouseMen: number;
    status: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    totalAmount: number;
    stockOutReasonName:string;
    stockOutReasonDescription: string;
}