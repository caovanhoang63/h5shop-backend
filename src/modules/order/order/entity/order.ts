export enum OrderType {
    Retail= 'retail',
    Wholesale= 'wholesale',
}

export interface Order {
    id: number;
    customerId?: number;
    sellerId: number;
    status: number;
    orderType: OrderType;
    description?: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    pointUsed : number;
}


export interface PayOrder {
    isUsePoint: boolean,
}