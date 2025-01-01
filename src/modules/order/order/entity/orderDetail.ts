import {OrderType} from "./order";

export interface OrderDetail {
    id: number;
    customerId: number;
    sellerId: number;
    status: number;
    orderType: OrderType;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItemDetail[];
}

export interface OrderItemDetail {
    orderId: number;
    skuId: number;
    amount: number;
    description?: string;
    unitPrice: number;
    discount: number;
    createdAt: Date;
}