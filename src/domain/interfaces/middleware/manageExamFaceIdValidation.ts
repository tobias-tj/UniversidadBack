import { body } from 'express-validator';

export const createExamFaceIdValidation = [
  body('faceId').notEmpty().withMessage('El FaceId es obligatorio'),
  body('code').notEmpty().withMessage('El code es obligatorio'),
];
