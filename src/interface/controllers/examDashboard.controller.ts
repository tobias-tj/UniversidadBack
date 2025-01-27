import { Request, Response, NextFunction } from 'express';
import { ExamRepository } from '../../infrastructure/repositories/exam/ExamRepository';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';

const examRepo = new ExamRepository();

export class ExamDashboardController {
  async getAllExams(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await examRepo.getExamCount();
      res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  }

  async getExamIncidentFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const exams = await examRepo.filterExams(filters);
      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  async getExamClean(req: Request, res: Response, next: NextFunction) {
    try {
      const cleanExamsCount = await examRepo.getCleanExamsCount();
      return res.status(200).json({ count: cleanExamsCount });
    } catch (error) {
      next(error);
    }
  }

  async getExamIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const { countOnly } = req.query;
      const exams = await examRepo.getExamsWithIncidents();

      if (countOnly === 'true') {
        return res.status(200).json({ count: exams.length });
      }

      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  async getAllTotalExamCount(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      logger.info('Inicia proceso para obtener total examenes');
      if (!errors.isEmpty) {
        res.status(400).json({ errors: errors.array() });
      }

      const examListTotal = await examRepo.getAllTotalExamCount();
      logger.info('Termina el proceso para obtener total examenes');
      return res.status(200).json({
        data: examListTotal,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListStudentIncidentByExamId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { examId } = req.params;
      const exams = await examRepo.getListStudentByExamId(Number(examId));

      if (!exams.length) {
        return res.status(200).json({
          exams,
          message: 'No se han registrado incidentes para este examen',
        });
      }

      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  async getAllListExamInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const exams = await examRepo.getAllListExamInfo();
      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }
}
