import { body } from 'express-validator';

export const updateAnunciosByIdValidation = [
  body('id')
    .notEmpty()
    .isNumeric()
    .withMessage('El id del anuncio es obligatorio'),
];
