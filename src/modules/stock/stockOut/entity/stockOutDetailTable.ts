export interface StockOutDetailTable {
    id: number;
    providerId: number;
    providerName: string;
    warehouseMen: number;
    warehouseName: string;
    items: StockItem[];
    totalAmount: number;
    status: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

interface StockItem{
    skuId: number;
    name: string;
    amount: number;
    price: number;
}