// HTTP status codes enum for better type safety
export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

// Base error interface
export interface ErrorDetails {
    message: string;
    code: HttpStatusCode;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

export class Err extends Error implements ErrorDetails {
    public readonly code: HttpStatusCode;
    public readonly timestamp: Date;
    public readonly key: string;
    public readonly originalError?: unknown;
    public readonly metadata?: Record<string, unknown>;

    constructor({
                    message,
                    key,
                    code,
                    originalError,
                    metadata
                }: {
        message: string;
        key: string;
        code: HttpStatusCode;
        originalError?: unknown;
        metadata?: Record<string, unknown>;
    }) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.timestamp = new Date();
        this.key = key;
        this.originalError = originalError;
        this.metadata = metadata;

        // Ensures proper prototype chain for ES5
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public equalTo(error: Err): boolean {
        return this.key === error.key;
    }

    public toJSON(): ErrorDetails {
        return {
            message: this.message,
            code: this.code,
            timestamp: this.timestamp,
            metadata: this.metadata
        };
    }
}

// Error factories
export const createDatabaseError = (originalError?: unknown, metadata?: Record<string, unknown>) =>
    new Err({
        message: 'An internal server error occurred',
        key: 'DB_ERROR',
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        originalError,
        metadata
    });

export const createInternalError = (originalError?: unknown, metadata?: Record<string, unknown>) =>
    new Err({
        message: 'An internal server error occurred',
        key: 'INTERNAL_SERVER_ERROR',
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        originalError,
        metadata
    });

export const createInvalidRequestError = (e: Error) => {
    return new Err({
        code: HttpStatusCode.BAD_REQUEST, key: "INVALID_REQUEST_ERROR", message: e.message, originalError: e
    });
}


export const createInvalidDataError = (e: Error) => {
    return new Err({
        code: HttpStatusCode.BAD_REQUEST, key: "INVALID_DATA_ERROR", message: e.message, originalError: e
    });
}


export const createUnauthorizedError = (metadata?: Record<string, unknown>) =>
    new Err({
        message: 'Unauthorized access',
        key: 'UNAUTHORIZED_ERROR',
        code: HttpStatusCode.UNAUTHORIZED,
        metadata
    });

export const createForbiddenError = (metadata?: Record<string, unknown>) =>
    new Err({
        message: 'Access forbidden',
        key: 'FORBIDDEN_ERROR',
        code: HttpStatusCode.FORBIDDEN,
        metadata
    });

export const createEntityNotFoundError = (entityName: string, metadata?: Record<string, unknown>) =>
    new Err({
        message: `${entityName} not found`,
        key: 'ENTITY_NOT_FOUND_ERROR',
        code: HttpStatusCode.NOT_FOUND,
        metadata
    });