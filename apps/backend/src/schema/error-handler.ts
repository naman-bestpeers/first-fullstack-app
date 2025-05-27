import { NextFunction, Request, Response } from "express"
import { ErrorCodes, HttpExceptions } from "../exceptions/root";
import { InternalEXception } from "../exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestException } from "../exceptions/bad-requests";


export const errorHandler =  (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error) {
            let exceptions: HttpExceptions;
            if(error instanceof HttpExceptions){
                exceptions = error;
            } else {
                if(error instanceof ZodError){
                    exceptions = new BadRequestException('Unprocessed Entity.', ErrorCodes.UNPROCESSED_DATA);
                }else{
                    exceptions = new InternalEXception('Something went wrong.',error, ErrorCodes.INTERNAL_EXCEPTION);
                }
            }
            next(exceptions);
        }
    }
}