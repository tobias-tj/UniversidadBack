import { Request, Response, NextFunction } from 'express';
import { ExamRepository } from '../../infrastructure/repositories/exam/ExamRepository';

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

  async getExamIncidentByUserID(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.params;
      const exams = await examRepo.getExamsByUserIdWithIncidents(Number(userID));

      if (!exams.length) {
        return res.status(404).json({ message: 'No se encontraron exámenes para el usuario' });
      }

      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }
}
