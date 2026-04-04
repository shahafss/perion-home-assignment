import 'reflect-metadata';
import 'dotenv/config';
import { app } from './app';
import { AppDataSource } from './config/database';

const port = Number(process.env.PORT || 4000);

const bootstrap = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to DB');

    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

void bootstrap();
