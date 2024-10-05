import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Express } from 'express';

// Cargamos el archivo YAML de Swagger
const swaggerDocument = YAML.load('./swagger.yaml');

function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export { setupSwagger };
