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
  passAdmin: string;
  connectionDb: string;
  universityName: string;
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
      passAdmin: decoded.passAdmin,
      connectionDb: decoded.connectionDb,
      universityName: decoded.universityName,
    };
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

export const generateToken = (payload: DecodedToken): string => {
  try {
    if (!SECRET_KEY) {
      throw new Error(
        'JWT_PRIVATE_KEY no está definido en las variables de entorno',
      );
    }

    // Configurar el tiempo de expiración (6 horas en segundos)
    const expiresIn = 6 * 60 * 60; // 6 horas

    // Generar el token con los datos del payload y tiempo de expiración
    const token = jwt.sign(
      {
        ...payload,
        // Asegurarnos de que el tiempo de creación sea el actual
        creationTime: Math.floor(Date.now() / 1000),
        // Establecer el tiempo de expiración
        expireTime: Math.floor(Date.now() / 1000) + expiresIn,
      },
      SECRET_KEY,
      { expiresIn },
    );

    return token;
  } catch (error) {
    console.error('Error al generar el token:', error);
    throw new Error('No se pudo generar el token');
  }
};
