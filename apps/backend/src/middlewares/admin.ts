import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";



const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    if(user.role === 'ADMIN'){
        next();
    }else{
        next(new UnauthorizedException('Unauthorized user!', ErrorCodes.UNAUTHORIZED));
    }
}

export default adminMiddleware;