import {OrderType} from "./order";

export interface OrderDetail {
    id: number;
    customerId: number;
    sellerId: number;
    status: number;
    orderType: OrderType;
    description?: string;
    createAt: Date | null;
    updateAt: Date | null;
    items: OrderItemDetail[];
}

export interface OrderItemDetail {
    orderId: number;
    skuId: number;
    amount: number;
    description?: string;
    unitPrice: number;
    discount: number;
    createAt: Date | null;
}