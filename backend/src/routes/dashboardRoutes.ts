import 'dotenv/config';
import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get('/', authMiddleware, dashboardController.getProfile);

export default dashboardRoutes;
