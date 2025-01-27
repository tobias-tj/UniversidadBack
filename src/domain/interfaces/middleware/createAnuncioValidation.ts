import { body } from 'express-validator';

export const createAnuncioValidation = [
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  body('visto')
    .optional({ nullable: true })
    .isBoolean()
    .withMessage('El campo "visto" debe ser un valor booleano'),
];
