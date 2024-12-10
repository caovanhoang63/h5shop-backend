export enum OrderType {
    Retail= 'retail',
    Wholesale= 'wholesale',
}

export interface Order {
    id: number;
    customerId: number;
    sellerId: number;
    orderType: OrderType | null;
    createAt: Date | null;
    updateAt: Date | null;
}