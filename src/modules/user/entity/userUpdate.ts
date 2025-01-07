import Joi from "joi";


export interface UserUpdate {
    phoneNumber?: string;
    address?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: Date | null;
    gender?: 'male' | 'female' | 'other';
}
export const userUpdateSchema = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional()
});