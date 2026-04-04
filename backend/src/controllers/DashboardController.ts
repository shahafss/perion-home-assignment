import 'dotenv/config';
import { Request, Response } from 'express';

export class DashboardController {
  getProfile = (req: Request, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    res.status(200).json({
      user: req.user
    });
  };
}
