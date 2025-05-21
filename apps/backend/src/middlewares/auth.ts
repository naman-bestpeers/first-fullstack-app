import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { prismaClient } from "..";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
     // 1. export the token from header
     let token = req.headers.authorization;

     // 2. if token is not present, throw an error of unauthorized
     if(!token){
        next(new UnauthorizedException('Unauthorized.', ErrorCodes.UNAUTHORIZED));
        return;
     }

     token = token.split(' ')?.[1];
     // 3. if token is present, verify the user and extract the payload
     try {
        const payload = jwt.verify(token, `${process.env.JWT_SECRET}`) as any;
     // 4. to get the user from payload
     const user = await prismaClient.user.findFirst({where: {id: payload.userId}});
     if(!user){
        next(new UnauthorizedException('Unauthorized.', ErrorCodes.UNAUTHORIZED));
        return;
     }
     // 5. to attach the user to the current request object
     req.user = user;
     next();
     } catch (error) {
        next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
     }
}

export default authMiddleware;