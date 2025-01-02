export interface WarrantyForm {
    id: number; // Primary key
    warrantyType: 'new' | 'fix' | 'part' | 'mf_fix'; // Enum for warranty types
    customerId?: number | null; // Foreign key, optional
    customerPhoneNumber: number;
    stockInId?: number | null; // Foreign key, optional
    skuId?: number; // Foreign key, required
    orderId: number; // Foreign key, required
    amount: number; // Default: 0
    returnDate?: Date; // ISO string format for timestamp, optional
    note?: string | null; // Optional text field
    status: number; // Default: 1
    createdAt?: Date; // ISO string format, default: current timestamp
    updatedAt?: Date; // ISO string format, updated on change
}
