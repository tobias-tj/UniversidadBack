import { Router, Request, Response, NextFunction } from 'express';
import { ManageExamController } from '../controllers/manageExam.controller';
import { ManageExamUserRepository } from '../../infrastructure/repositories/manage_exam_user/ManageExamUserRepository';
import { CreateExamUser } from '../../usecases/manage_exam_user/CreateExamUser';
import { createExamUserValidation } from '../../domain/interfaces/middleware/manageExamUserValidation';

const router = Router();

const manageExamUserRepository = new ManageExamUserRepository();
const manageExamUser = new CreateExamUser(manageExamUserRepository);

const manageExamUserController = new ManageExamController(manageExamUser);

router.post(
  '/manageExamUser',
  [...createExamUserValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageExamUserController.manageCreateExamProcess(req, res, next),
);

export { router as manageExamUserRoutes };
