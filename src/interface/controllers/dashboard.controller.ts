import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { StudentFindAll } from '../../usecases/students/StudentFindAll';
import { GetStudentIncident } from '../../usecases/dashboard/getStudentIncident';
import { GetIncidentsByStudentId } from '../../usecases/dashboard/GetIncidentsByStudentId';
import { GetAllStudentsIncidentCount } from '../../usecases/dashboard/GetAllStudentsIncidentCount';
import { GetCredits } from '../../usecases/dashboard/GetCredits';

export class dashboardController {
  constructor(
    private StudentIncident: GetStudentIncident,
    private StudentIncidentByExamId: GetIncidentsByStudentId,
    private studentCount: GetAllStudentsIncidentCount,
    private getCreditsByUniversity: GetCredits,
  ) {}

  async getStudentIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const {
        page = '1',
        limit = '10',
        search = '',
        sortBy = 'nombre',
        order = 'asc',
      } = req.query;

      const filters = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        search: String(search),
        sortBy: String(sortBy),
        order: String(order),
      };

      // Siempre devuelve data + totalCount
      const result = await this.StudentIncident.execute(
        decoded.connectionDb,
        false,
        filters,
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStudentsIncidentByStudentId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }
      const errors = validationResult(req);
      logger.info(
        'Inicia proceso de obtener estudiantes con incidencias por StudentId',
      );
      const studentId = req.query.id as string;
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const studentList = await this.StudentIncidentByExamId.execute(
        decoded.connectionDb,
        studentId,
      );
      logger.info(
        'Termina proceso de obtener estudiantes con incidencias por StudentId',
      );
      return res.status(200).json({
        data: studentList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllStudentsCount(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Inicia proceso de obtener estudiantes');

      // Extraer y validar token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      // Ejecutar caso de uso con la conexión del token
      const studentList = await this.studentCount.execute(decoded.connectionDb);

      logger.info('Termina proceso de obtener estudiantes');
      return res.status(200).json({ data: studentList });
    } catch (error) {
      logger.error('Error en getAllStudentsCount:', error);
      next(error);
    }
  }

  async getCredits(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Inicia proceso de obtener creditos');
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      if (!decoded?.idUniversidad) {
        return res.status(401).json({ error: 'Token inválido falta IDs' });
      }

      console.log('Id de universidad---->', decoded.idUniversidad);

      const credits = await this.getCreditsByUniversity.execute(
        decoded.idUniversidad,
      );

      if (!credits) {
        return res.status(404).json({ error: 'No se encontraron creditos' });
      }

      console.log('Los creditos encontrados---->', credits);

      logger.info('Termina proceso de obtener creditos');
      return res.status(200).json({ data: credits });
    } catch (error) {
      logger.error('Error en getCredits:', error);
      next(error);
    }
  }
}
