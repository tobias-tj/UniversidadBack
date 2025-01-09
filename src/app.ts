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

// Configuración de Jasper
const jasper = JasperConfig({
  path: 'lib/jasperreports-5.6.0',
  reports: {
    main: {
      jrxml: 'jrxml/test/rel_teste.jrxml',
      conn: 'default',
    },
  },
  drivers: {
    postgres: {
      path: 'jar/postgresql-42.5.0.jar', // Ruta del conector JDBC para PostgreSQL
      class: 'org.postgresql.Driver', // Clase del driver
      type: 'postgres',
    },
  },
  conns: {
    // default: {
    //   user: process.env.DB_USER || 'postgres',
    //   pass: process.env.DB_PASS || 'postgres',
    //   jdbc:
    //     process.env.DB_JDBC || 'jdbc:postgresql://localhost:5432/mydatabase', // Cambia por tu conexión
    //   driver: 'postgres',
    // },
  },
  defaultConn: 'default',
  tmpPath: 'jrxml/test',
  java: ['-Djava.awt.headless=true'],
});

// Compilación de JRXML
// jasper.compileJRXMLInDirSync('jrxml/test');

// Ruta para generar PDF
app.get('/pdf', async (req, res, next) => {
  try {
    const report = {
      report: 'reporte_usuario.jasper',
      data: {
        id: parseInt(req.query.id as string, 10), // Conversión a número
        secundaryDataset: jasper.toJsonDataSource(
          {
            // Ajusta esta estructura con los datos adecuados
            data: [{ example: 'data1' }, { example: 'data2' }],
          },
          'data',
        ),
      },
      dataset: {
        // Ajusta con tu dataset principal
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
        ],
      },
    };

    const pdf = jasper.pdf(report);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length,
    });
    res.send(pdf);
  } catch (error) {
    logger.error(`Error generating PDF: ${error.message}`);
    next(error);
  }
});

// Inicio del servidor
const startServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

startServer();
