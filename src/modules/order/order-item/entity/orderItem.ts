export interface OrderItem {
    orderId: number;
    skuId: number;
    amount: number;
    description?: string;
    unitPrice: number;
    discount: number;
    createdAt: Date | null;
}