import Joi from "joi";

export interface Employee {
    id: number;
    phoneNumber: string;
    address: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date | null;
    gender: 'male' | 'female' | 'other';
    status: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface EmployeeUpdate {
    phoneNumber?: string;
    address?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: Date | null;
    gender: 'male' | 'female' | 'other';

}
export const employeeUpdateSchema = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'other').required()
});

export interface EmployeeCreate{
    phoneNumber: string;
    address: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date
    gender: 'male' | 'female' | 'other';

}
export const employeeCreateSchema = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required()
})