import { query } from 'express-validator';

export const validateAccessCheckoutRequest = [
  query('userId').notEmpty().withMessage('El campo userId es obligatorio'),];
