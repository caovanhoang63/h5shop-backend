import Joi from "joi";

export interface Provider {
    id: number;
    name: string;
    address: string;
    email: string,
    phone_number: string,
    debt: number,
    status: number,
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface ProviderCreate extends Omit<Provider, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
}
export const providerCreateSchema = Joi.object({
    name: Joi.string().max(255).required(),
    address: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().max(255).required(),
    debt: Joi.number().required()
})