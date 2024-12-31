export interface StockInTable {
    id: number;
    providerId: number;
    providerName: string;
    warehouseMen: number;
    totalAmount: number;
    status: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}