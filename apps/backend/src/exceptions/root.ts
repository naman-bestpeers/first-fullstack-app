// message, status code, error codes, error

export class HttpExceptions extends Error {
    message: string;
    errorCode: ErrorCodes;
    statusCode: number;
    errors: any;

    constructor(message: string, errorCode: ErrorCodes, statusCode: number, error: any) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = error
    }
}

export enum ErrorCodes {
    USER_NOT_FOUND = 901,
    USER_ALREADY_EXISTS = 902,
    INCORRECT_PASSWORD = 903,
    UNPROCESSED_DATA = 904,
    INTERNAL_EXCEPTION = 905,
    UNAUTHORIZED = 906,
}