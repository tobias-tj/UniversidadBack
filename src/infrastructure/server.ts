import cors from 'cors';
import express from 'express';
import { firstProcessRoutes } from '../interface/routes/firstProcessRoutes';
import { errorHandler } from '../domain/interfaces/middleware/errorHandler';
import { setupSwagger } from '../interface/swagger';
import { manageExamUserRoutes } from '../interface/routes/manageExamUserRoutes';
import { accessCheckoutRoutes } from '../interface/routes/accessCheckoutRoutes';
import { dashboardRoutes } from '../interface/routes/dashboardRoutes';
import { examDashboardRoutes } from '../interface/routes/examDashboardRoutes';
import { reportRoutes } from '../interface/routes/reportRoutes';
import { anunciosRoutes } from '../interface/routes/anunciosRoutes';
import { adminLoginRoutes } from '../interface/routes/adminLoginRoutes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(
  '/api',
  firstProcessRoutes,
  manageExamUserRoutes,
  accessCheckoutRoutes,
  examDashboardRoutes,
  dashboardRoutes,
  reportRoutes,
  anunciosRoutes,
  adminLoginRoutes
);
app.use(errorHandler);
setupSwagger(app);

export default app;
