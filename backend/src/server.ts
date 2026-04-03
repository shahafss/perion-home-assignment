import 'reflect-metadata';
import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  // Infrastructure phase: simple startup log.
  console.log(`Backend listening on port ${port}`);
});
