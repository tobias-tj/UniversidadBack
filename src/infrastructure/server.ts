import cors from 'cors';
import express from 'express';
import { studentRoutes } from '../interface/routes/studentRoutes';
import { errorHandler } from '../domain/interfaces/middleware/errorHandler';
import { setupSwagger } from '../interface/swagger';
import { manageExamUserRoutes } from '../interface/routes/manageExamUserRoutes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', studentRoutes, manageExamUserRoutes);
app.use(errorHandler);
setupSwagger(app);

export default app;
