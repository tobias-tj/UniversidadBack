import { body } from 'express-validator';

export const adminLoginValidation = [
  body('idUniversidad')
    .isNumeric()
    .withMessage('El ID de universidad debe ser numérico'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];
