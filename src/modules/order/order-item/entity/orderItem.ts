export interface OrderItem {
    orderId: number;
    skuId: number;
    amount: number;
    description?: string;
    unitPrice: number;
    discount: number;
    createAt: Date | null;
}