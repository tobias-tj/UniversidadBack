import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateExamUserDTO } from '../../domain/interfaces/dto/manage_exam_user/CreateExamUserDto';
import { CreateExamUser } from '../../usecases/manage_exam_user/CreateExamUser';
import { CreateFaceId } from '../../usecases/manage_exam_user/CreateFaceIdUser';
import { CreateStartTime } from '../../usecases/manage_exam_user/StartTimeExam';

export class ManageExamController {
  constructor(
    private createExamUserUsecase: CreateExamUser,
    private createFaceIdUseCase: CreateFaceId,
    private createStartTime: CreateStartTime,
  ) {}

  async manageCreateExamProcess(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id, code } = req.body;

      const createExamUser = new CreateExamUserDTO(id, code);
      // Renombramos por un nombre mas identificable
      const idExamen = createExamUser.id;
      const idUsuario = createExamUser.code;

      const createdId = await this.createExamUserUsecase.execute(
        idExamen,
        idUsuario,
      );

      if (createdId == null) {
        // Algun Conflicto con los datos
        return res.status(409);
      }

      return res.status(201).json({
        createdId: createdId,
      });
    } catch (error) {
      next(error);
    }
  }

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
}
