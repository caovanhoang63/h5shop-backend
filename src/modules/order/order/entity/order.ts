export enum OrderType {
    Retail= 'retail',
    Wholesale= 'wholesale',
}

export interface Order {
    id: number;
    customerId: number;
    sellerId: number;
    orderType: OrderType;
    description?: string;
    createAt: Date | null;
    updateAt: Date | null;
}