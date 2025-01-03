import {OrderType} from "./order";
import {SkuListDetail} from "../../../catalog/sku/entity/skuListDetail";

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
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    pointUsed: number
}

export interface OrderItemDetail {
    orderId: number;
    skuId: number;
    amount: number;
    description?: string;
    unitPrice: number;
    createdAt: Date;
    skuDetail?: SkuListDetail;
}