import dotenv from 'dotenv';
import app from './infrastructure/server';
import { logger } from './infrastructure/logger';
import * as express from 'express';
import cors from 'cors';
import { JasperConfig } from 'node-jasper-ts';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3010',
  ],
};
app.use(cors(corsOptions));

// TODO: Descomentar en el caso de contar con Jasper en el local corriendo
// // Configuración de Jasper
// const jasper = JasperConfig({
//   path: 'lib/jasperreports-5.6.0',
//   reports: {
//     main: {
//       jrxml: 'jrxml/test/rel_teste.jrxml',
//       conn: 'default',
//     },
//   },
//   drivers: {
//     postgres: {
//       path: 'jar/postgresql-42.5.0.jar', // Ruta del conector JDBC para PostgreSQL
//       class: 'org.postgresql.Driver', // Clase del driver
//       type: 'postgres',
//     },
//   },
//   conns: {
//     // default: {
//     //   user: process.env.DB_USER || 'postgres',
//     //   pass: process.env.DB_PASS || 'postgres',
//     //   jdbc:
//     //     process.env.DB_JDBC || 'jdbc:postgresql://localhost:5432/mydatabase', // Cambia por tu conexión
//     //   driver: 'postgres',
//     // },
//   },
//   defaultConn: 'default',
//   tmpPath: 'jrxml/test',
//   java: ['-Djava.awt.headless=true'],
// });

// Compilación de JRXML
// jasper.compileJRXMLInDirSync('jrxml/test');

// Ruta para generar PDF
// app.get('/pdf', async (req, res, next) => {
//   try {
//     const report = {
//       report: 'reporte_usuario.jasper',
//       data: {
//         id: parseInt(req.query.id as string, 10), // Conversión a número
//         secundaryDataset: jasper.toJsonDataSource(
//           {
//             // Ajusta esta estructura con los datos adecuados
//             data: [{ example: 'data1' }, { example: 'data2' }],
//           },
//           'data',
//         ),
//       },
//       dataset: {
//         // Ajusta con tu dataset principal
//         data: [
//           { id: 1, name: 'John Doe' },
//           { id: 2, name: 'Jane Smith' },
//         ],
//       },
//     };

//     const pdf = await jasper.pdf(report);
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Length': pdf.length.toString(),
//     });
//     res.send(pdf);
//   } catch (error:any) {
//     logger.error(`Error generating PDF: ${error.message}`);
//     next(error);
//   }
// });

// // Ruta para generar PDF
// app.get('/generateReportPdf', async (req, res, next) => {
//   try {
//     // Recuperar parámetros de la query
//     const { idUniversidad, idUser, fecha } = req.query;

//     // Asegurarse de que los parámetros sean válidos
//     if (!idUser || !fecha) {
//       return res
//         .status(400)
//         .send('Faltan parámetros necesarios: idUniversidad, idUser, fecha');
//     }
//     logger.info(req.query);
//     // Datos para el reporte
//     const report = {
//       report: 'reporte_usuario.jasper', // Nombre del reporte Jasper
//       data: {
//         id: parseInt(idUniversidad as string, 10), // Convertir idUniversidad a número
//         secundaryDataset: jasper.toJsonDataSource(
//           {
//             data: [
//               { idUniversidad: (idUniversidad as string) ?? '1' },
//               { idUser: idUser as string },
//               { fecha: fecha as string },
//             ], // Ajusta esta estructura con tus datos secundarios
//           },
//           'data',
//         ),
//       },
//       JasperParameters: {
//         IdUniversidad: parseInt((idUniversidad as string) ?? '1', 10),
//         IdUsuario: parseInt(idUser as string, 10),
//         Fecha: fecha as string, // Si es necesario, convierte a un formato de fecha
//       },
//       dataset: {
//         IdUniversidad: parseInt((idUniversidad as string) ?? '1', 10),
//         IdUsuario: parseInt(idUser as string, 10),
//         Fecha: fecha as string, // Si es necesario, convierte a un formato de fecha
//       },
//     };

//     // Generación del PDF
//     const pdf = await jasper.pdf(report); // Asumiendo que jasper.pdf devuelve un Buffer
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Length': pdf.length.toString(), // Convertir longitud a string
//     });
//     res.send(pdf); // Enviar el PDF generado al cliente
//     return pdf;
//   } catch (error: any) {
//     console.error(`Error generating PDF: ${error.message}`);
//     next(error); // Propagar el error al middleware de manejo de errores
//   }
// });

// Inicio del servidor
const startServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
