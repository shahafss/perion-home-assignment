import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/signup', authController.signup);
authRoutes.post('/login', authController.login);

export default authRoutes;
