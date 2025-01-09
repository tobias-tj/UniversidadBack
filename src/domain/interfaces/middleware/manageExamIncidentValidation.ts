import { body } from 'express-validator';

export const validateIncident = [
  body('createId')
    .notEmpty()
    .withMessage('El id de relación es obligatorio.')
    .isInt()
    .withMessage('El id debe ser un número entero.'),
  body('incidentType')
    .notEmpty()
    .withMessage('El tipo de incidente es obligatorio.')
    .isString()
    .withMessage('El tipo de incidente debe ser un texto.'),
  body('time')
    .notEmpty()
    .withMessage('El tiempo es obligatorio.')
    .withMessage('El tiempo es obligatorio'),
  body('img')
    .notEmpty()
    .withMessage('La imagen en formato Base64 es obligatoria.')
    .isString()
    .withMessage('La imagen debe ser un texto en formato Base64.')
    .matches(/^data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/]+={0,2}$/)
    .withMessage(
      "La imagen debe tener un formato Base64 válido con el prefijo 'data:image/'.",
    ),
];
