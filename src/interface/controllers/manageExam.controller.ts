import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateFaceId } from '../../usecases/manage_exam_user/CreateFaceIdUser';
import { CreateStartTime } from '../../usecases/manage_exam_user/StartTimeExam';
import { CreateFinishTime } from '../../usecases/manage_exam_user/FinishTimeExam';

export class ManageExamController {
  constructor(
    private createFaceIdUseCase: CreateFaceId,
    private createStartTime: CreateStartTime,
    private createFinishTime: CreateFinishTime,
  ) {}

  async manageCreateFaceId(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { faceId, code } = req.body;
      const createFaceId = await this.createFaceIdUseCase.execute(faceId, code);

      if (!createFaceId) {
        // Algun Conflicto con los datos
        return res.status(409);
      }

      return res.status(200).json({
        message: 'FaceId Generado Correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async manageStartTimeExam(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { createdId } = req.body;
      const processStartExam = await this.createStartTime.execute(createdId);

      if (!processStartExam) {
        return res.status(409);
      }

      return res.status(200).json({
        message: 'Examen procesado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async manageFinishTimeExam(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { createdId } = req.body;
      const processFinishExam = await this.createFinishTime.execute(createdId);

      if (!processFinishExam) {
        return res.status(409);
      }

      return res.status(200).json({
        message: 'Examen finalizado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
