import { body } from 'express-validator';

export const createStudentValidation = [
  body('idUsuario').notEmpty().withMessage('El id del usuario es obligatorio'),
  body('fullname').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
];
