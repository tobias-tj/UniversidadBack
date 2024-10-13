import { body } from 'express-validator';

export const createExamValidation = [
  body('idFormulario')
    .isInt()
    .withMessage('Debe ser un ID de formulario válido'),
  body('courseName')
    .notEmpty()
    .withMessage('El nombre del curso es obligatorio'),
  body('estado')
    .isIn(['pendiente', 'finalizado'])
    .withMessage('El estado no es válido'),
];
