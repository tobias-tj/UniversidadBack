import { body } from 'express-validator';

export const validateIncident = [
  body('createId').notEmpty().withMessage('El id de relación es obligatorio.'),
  body('incidentType')
    .notEmpty()
    .withMessage('El tipo de incidente es obligatorio.')
    .isString()
    .withMessage('El tipo de incidente debe ser un texto.'),
  body('screen')
    .optional() // Es opcional, ya que no siempre se enviará si no es un incidente relacionado con la pantalla.
    .isString()
    .withMessage('La captura de pantalla debe ser una cadena válida.')
    .matches(/^data:image\/(jpeg|png);base64,/)
    .withMessage(
      'La captura de pantalla debe ser un formato base64 de imagen válida.',
    ),
  body('time')
    .notEmpty()
    .withMessage('El tiempo es obligatorio.')
    .withMessage('El tiempo es obligatorio'),
];
