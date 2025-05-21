import { ErrorCodes, HttpExceptions } from "./root";

export class BadRequestException extends HttpExceptions {
  constructor(message: string, errorCode: ErrorCodes) {
    super(message, errorCode, 400, null);
  }
}
