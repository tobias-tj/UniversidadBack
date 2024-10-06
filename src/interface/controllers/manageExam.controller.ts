import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateExamUserDTO } from '../../domain/interfaces/dto/manage_exam_user/CreateExamUserDto';
import { CreateExamUser } from '../../usecases/manage_exam_user/CreateExamUser';

export class ManageExamController {
  constructor(private createExamUserUsecase: CreateExamUser) {}

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

      await this.createExamUserUsecase.execute(idExamen, idUsuario);

      return res.status(201).json({
        message: 'El proceso de vinculacion de examen y usuario fue exitoso.',
      });
    } catch (error) {
      next(error);
    }
  }

  //async manageStartExamProcess
}
