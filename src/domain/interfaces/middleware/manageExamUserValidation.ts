import { body } from 'express-validator';

export const createExamUserValidation = [
  body('id').notEmpty().withMessage('El id es obligatorio'),
  body('code').notEmpty().withMessage('El code es obligatorio'),
];
