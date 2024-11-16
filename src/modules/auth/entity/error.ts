import {Err, HttpStatusCode} from "../../../libs/errors";

export const ErrUserNameAlreadyExists = (username: string, metadata?: Record<string, unknown>) =>
    new Err({
        message: `Username '${username}' is already taken`,
        key: 'USERNAME_ALREADY_EXISTS',
        code: HttpStatusCode.BAD_REQUEST,
        metadata: {
            username,
            ...metadata
        }
    });

export const createWeakPasswordError = (metadata?: Record<string, unknown>) =>
    new Err({
        message: 'Password does not meet strength requirements',
        key: 'WEAK_PASSWORD',
        code: HttpStatusCode.BAD_REQUEST,
        metadata: {
            requirements: [
                'Minimum 8 characters',
                'At least one uppercase letter',
                'At least one lowercase letter',
                'At least one number',
                'At least one special character'
            ],
            ...metadata
        }
    });


export const ErrInvalidCredentials = (metadata?: Record<string, unknown>) =>
    new Err({
        message: 'Invalid username or password',
        key: 'INVALID_CREDENTIALS',
        code: HttpStatusCode.BAD_REQUEST,
        metadata: {
            attemptTimestamp: new Date(),
            ...metadata
        }
    });
