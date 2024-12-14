export interface InventoryReportTable {
    id: number;
    amount: number;
    warehouseMan: number;
    status: number;
    inventoryDif: number;
    note: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}