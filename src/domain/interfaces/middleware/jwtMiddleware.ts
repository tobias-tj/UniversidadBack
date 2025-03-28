import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

interface DecodedToken {
  userId: string;
  formId: number;
  cmid: number;
  formUrl: string;
  firstname: string;
  lastname: string;
  courseName: string;
  email: string;
  creationTime: number;
  expireTime: number;
  moodleUrl: string;
  idUniversidad: number;
  emailAdmin: string;
  passwordAdmin: string;
  connectionDb: string;
}

dotenv.config();
const key = process.env.JWT_PRIVATE_KEY;

export const SECRET_KEY = key; // Asegúrate de que este valor sea seguro y no esté hardcodeado en tu código.

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as any; // Ajusta el tipo según la estructura de tu token

    // Extraer los datos que necesitas
    return {
      userId: decoded.userId,
      formId: decoded.formId,
      cmid: decoded.cmid,
      formUrl: decoded.formUrl,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      courseName: decoded.courseName,
      email: decoded.email,
      creationTime: decoded.creationTime,
      expireTime: decoded.expireTime,
      moodleUrl: decoded.moodleUrl,
      idUniversidad: decoded.idUniversidad,
      emailAdmin: decoded.emailAdmin,
      passwordAdmin: decoded.passwordAdmin,
      connectionDb: decoded.connectionDb,
    };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};
