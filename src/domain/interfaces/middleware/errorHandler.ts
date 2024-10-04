import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  status?: number; // Código de estado HTTP
  details?: any; // Detalles adicionales del error
}

// Manejo de errores
export function errorHandler(
  err: CustomError, // Usamos el tipo extendido
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err.stack); // Imprimir el stack trace del error para depuración

  // Verificar si el error tiene un código de estado, si no, devolver 500
  const statusCode = err.status || 500;

  // Responder con un mensaje de error personalizado basado en el tipo de error
  switch (statusCode) {
    case 400:
      return res.status(400).json({
        message: 'Bad Request',
        details: err.details || 'Error en la solicitud',
      });
    case 401:
      return res.status(401).json({
        message: 'Unauthorized',
        details:
          err.details || 'No tienes autorización para realizar esta acción',
      });
    case 403:
      return res.status(403).json({
        message: 'Forbidden',
        details: err.details || 'Acceso prohibido',
      });
    case 404:
      return res.status(404).json({
        message: 'Not Found',
        details: err.details || 'El recurso solicitado no existe',
      });
    case 409:
      return res.status(409).json({
        message: 'Conflict',
        details: err.details || 'Conflicto con los datos enviados',
      });
    case 500:
    default:
      return res.status(500).json({
        message: 'Internal Server Error',
        details: err.details || 'Algo salió mal en el servidor',
      });
  }
}
