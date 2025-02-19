export interface InventoryReportDetailTable {
    inventoryReportId: number;
    amount: number;
    warehouseMan: number;
    warehouseName: string;
    status: number;
    items: InventoryItem[];
    note: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

interface InventoryItem{
    skuId: number;
    name: string;
    oldStock: number;
    price:number | null;
    amount: number;
    inventoryDif: number;
}