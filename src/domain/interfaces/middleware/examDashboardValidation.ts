import { query, param } from 'express-validator';

export const validateExamIncidentFilter = [
  query('fechaInicio').optional().isISO8601().withMessage('Fecha inválida'),
  query('fechaFin').optional().isISO8601().withMessage('Fecha inválida'),
  query('descripcion').optional().isString().withMessage('Debe ser un texto válido'),
];

export const validateExamIncidentByUserID = [
  param('userID').isNumeric().withMessage('El userID debe ser un número'),
];

export const validateExamIncident = [
  query('countOnly')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('countOnly debe ser true o false'),
];
