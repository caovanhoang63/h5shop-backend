export interface Auth {
    id: number;
    userId: number;
    userName: string;
    salt: string;
    password: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}





