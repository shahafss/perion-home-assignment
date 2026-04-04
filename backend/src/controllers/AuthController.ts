import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService, AuthServiceError } from '../services/AuthService';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export class AuthController {
  private authService = new AuthService();

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = authSchema.parse(req.body);
      const result = await this.authService.signup(email, password);
      res.status(201).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = authSchema.parse(req.body);
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Invalid request body',
        errors: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      });
      return;
    }

    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error('Unexpected auth controller error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
