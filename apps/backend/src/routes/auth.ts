import { Router } from 'express';
import { login, profile, signup } from '../controllers/auth';
import { errorHandler } from '../schema/error-handler';
import authMiddleware from '../middlewares/auth';

const authRoutes: Router = Router();

authRoutes.post('/signup', errorHandler(signup));

authRoutes.post('/login', errorHandler(login));

authRoutes.get('/profile', [authMiddleware], errorHandler(profile)); 


export default authRoutes;