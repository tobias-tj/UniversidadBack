import dotenv from 'dotenv';
import app from './infrastructure/server';
import { logger } from './infrastructure/logger';

dotenv.config();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3010',
  ],
};

app.use(cors(corsOptions));
const startServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
