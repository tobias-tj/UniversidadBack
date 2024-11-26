import { body } from "express-validator";

export const validateIncident = [
  body("createId").notEmpty().withMessage("El id de relación es obligatorio.").isInt().withMessage("El id debe ser un número entero."),
  body("incidentType").notEmpty().withMessage("El tipo de incidente es obligatorio.").isString().withMessage("El tipo de incidente debe ser un texto."),
  body("time").notEmpty().withMessage("El tiempo es obligatorio.").withMessage("El tiempo es obligatorio"),
];
