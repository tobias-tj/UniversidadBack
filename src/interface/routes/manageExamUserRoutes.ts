import { Router, Request, Response, NextFunction } from 'express';
import { ManageExamController } from '../controllers/manageExam.controller';
import { ManageExamUserRepository } from '../../infrastructure/repositories/manage_exam_user/ManageExamUserRepository';
import { CreateExamUser } from '../../usecases/manage_exam_user/CreateExamUser';
import { createExamUserValidation } from '../../domain/interfaces/middleware/manageExamUserValidation';
import { CreateFaceId } from '../../usecases/manage_exam_user/CreateFaceIdUser';
import { createExamFaceIdValidation } from '../../domain/interfaces/middleware/manageExamFaceIdValidation';
import { CreateStartTime } from '../../usecases/manage_exam_user/StartTimeExam';
import { createExamStartTimeValidation } from '../../domain/interfaces/middleware/manageExamStartTimeValidation';
import { CreateFinishTime } from '../../usecases/manage_exam_user/FinishTimeExam';

const router = Router();

const manageExamUserRepository = new ManageExamUserRepository();
const manageExamUser = new CreateExamUser(manageExamUserRepository);
const manageExamFaceId = new CreateFaceId(manageExamUserRepository);
const manageStartTime = new CreateStartTime(manageExamUserRepository);
const manageFinishTime = new CreateFinishTime(manageExamUserRepository);

const manageExamUserController = new ManageExamController(
  manageExamUser,
  manageExamFaceId,
  manageStartTime,
  manageFinishTime,
);

router.post(
  '/manageExamUser',
  [...createExamUserValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageExamUserController.manageCreateExamProcess(req, res, next),
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

export { router as manageExamUserRoutes };
