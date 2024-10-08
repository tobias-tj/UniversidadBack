import { body } from 'express-validator';

export const createExamStartTimeValidation = [
  body('createdId').notEmpty().withMessage('El id es obligatorio'),
];
