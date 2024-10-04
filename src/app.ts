import dotenv from 'dotenv';
import app from './infrastructure/server';
import { logger } from './infrastructure/logger';

dotenv.config();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
