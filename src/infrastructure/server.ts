import cors from 'cors';
import express from 'express';
import { firstProcessRoutes } from '../interface/routes/firstProcessRoutes';
import { errorHandler } from '../domain/interfaces/middleware/errorHandler';
import { setupSwagger } from '../interface/swagger';
import { manageExamUserRoutes } from '../interface/routes/manageExamUserRoutes';
import { accessCheckoutRoutes } from '../interface/routes/accessCheckoutRoutes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', firstProcessRoutes, manageExamUserRoutes, accessCheckoutRoutes);
app.use(errorHandler);
setupSwagger(app);

export default app;
