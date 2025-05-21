import { ErrorCodes, HttpExceptions } from "./root";

export class notFoundException extends HttpExceptions {
  constructor(message: string, errorCode: ErrorCodes) {
    super(message, errorCode, 404, null);
  }
}
