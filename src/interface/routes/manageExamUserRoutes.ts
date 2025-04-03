import { Router, Request, Response, NextFunction } from 'express';
import { ManageExamController } from '../controllers/manageExam.controller';
import { ManageExamUserRepository } from '../../infrastructure/repositories/manage_exam_user/ManageExamUserRepository';
import { CreateFaceId } from '../../usecases/manage_exam_user/CreateFaceIdUser';
import { createExamFaceIdValidation } from '../../domain/interfaces/middleware/manageExamFaceIdValidation';
import { CreateStartTime } from '../../usecases/manage_exam_user/StartTimeExam';
import { createExamStartTimeValidation } from '../../domain/interfaces/middleware/manageExamStartTimeValidation';
import { CreateFinishTime } from '../../usecases/manage_exam_user/FinishTimeExam';
import { validateIncident } from '../../domain/interfaces/middleware/manageExamIncidentValidation';
import { ManageExamIncident } from '../../usecases/manage_exam_user/ManageExamIncident';
import { ManageExamIncidentRepository } from '../../infrastructure/repositories/manage_exam_user/ManageExamIncidentRepository';

const router = Router();

const manageExamUserRepository = new ManageExamUserRepository();
const manageExamFaceId = new CreateFaceId(manageExamUserRepository);
const manageStartTime = new CreateStartTime(manageExamUserRepository);
const manageFinishTime = new CreateFinishTime(manageExamUserRepository);
const manageExamIncidentRepo = new ManageExamIncidentRepository();
const manageExamIncidentUseCase = new ManageExamIncident(
  manageExamIncidentRepo,
);

const manageExamUserController = new ManageExamController(
  manageExamFaceId,
  manageStartTime,
  manageFinishTime,
  manageExamIncidentUseCase,
);

router.patch(
  '/manageFaceId',
  [...createExamFaceIdValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageExamUserController.manageCreateFaceId(req, res, next),
);

router.patch(
  '/manageStartTimeExam',
  [...createExamStartTimeValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageExamUserController.manageStartTimeExam(req, res, next),
);

router.patch(
  '/manageFinishTimeExam',
  [...createExamStartTimeValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageExamUserController.manageFinishTimeExam(req, res, next),
);

router.post(
  '/manageReportExam',
  validateIncident,
  (req: Request, res: Response, next: NextFunction) =>
    manageExamUserController.manageIncidentExam(req, res, next),
);
export { router as manageExamUserRoutes };
