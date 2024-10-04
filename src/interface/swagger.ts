import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'University Backend Security',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Asegúrate de que Swagger apunte a la URL base correcta
      },
    ],
  },
  apis: ['./src/interface/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export { setupSwagger };
