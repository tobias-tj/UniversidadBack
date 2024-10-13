import { body } from 'express-validator';

export const createExamUserValidation = [
  body('formId').notEmpty().withMessage('El FormId es obligatorio'),
  body('userId').notEmpty().withMessage('El UserId es obligatorio'),
];
