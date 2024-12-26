export interface StockInTable {
    id: number;
    providerId: number;
    warehouseMen: number;
    totalAmount: number;
    status: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}