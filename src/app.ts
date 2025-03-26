import dotenv from 'dotenv';
import app from './infrastructure/server';
import { logger } from './infrastructure/logger';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://161.35.53.140:5173',
    'http://localhost:5173',
    'http://161.35.53.140:5174',
    'http://localhost:5174',
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
