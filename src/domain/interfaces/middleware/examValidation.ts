import { body } from 'express-validator';

export const createExamValidation = [
  body('idFormulario')
    .isInt()
    .withMessage('Debe ser un ID de formulario válido'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  body('estado')
    .isIn(['pendiente', 'finalizado'])
    .withMessage('El estado no es válido'),
];
