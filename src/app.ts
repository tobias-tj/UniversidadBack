import dotenv from 'dotenv';
import app from './infrastructure/server';
import { logger } from './infrastructure/logger';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;

console.log('📌 DATABASE_URL:', process.env.DATABASE_URL);
logger.info('📌 DATABASE_URL:', process.env.DATABASE_URL);

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://161.35.53.140:5173',
    'http://161.35.53.140:5174',
    'http://localhost:3010',
  ],
};
app.use(cors(corsOptions));

// Inicio del servidor
const startServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
