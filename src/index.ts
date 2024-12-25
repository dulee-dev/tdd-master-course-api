import express from 'express';
import { initLog } from './libs/logs.js';
import routes from './routes/index.js';
import { buildSwagger } from './libs/swagger.js';
import swaggerUi from 'swagger-ui-express';

const port = process.env.PORT ? +process.env.PORT : 4000;

const main = async (port: number) => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const swaggerSpec = buildSwagger(port);
  if (swaggerSpec)
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(routes);

  app.listen(port);
  await initLog(port);
};

main(port);
