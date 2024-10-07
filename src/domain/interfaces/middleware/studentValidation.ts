import { body } from 'express-validator';

export const createStudentValidation = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('rol').notEmpty().withMessage('El rol es obligatorio'),
];
