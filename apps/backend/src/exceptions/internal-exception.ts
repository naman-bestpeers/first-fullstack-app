import { HttpExceptions } from "./root";


export class InternalEXception extends HttpExceptions {
    constructor(message: string, errors: any, errorCode: number){
        super(message, errorCode, 500, errors);
    }
}