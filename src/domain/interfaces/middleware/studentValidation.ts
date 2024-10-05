import { body } from 'express-validator';

export const createStudentValidation = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('rol').notEmpty().withMessage('El rol es obligatorio'),
];

export const createExamValidation = [
  body('idFormulario')
    .isInt()
    .withMessage('Debe ser un ID de formulario válido'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  body('estado')
    .isIn(['pendiente', 'finalizado'])
    .withMessage('El estado no es válido'),
];
