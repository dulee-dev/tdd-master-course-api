#!/usr/bin/env node

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import express from 'express';
import { initLog } from './libs/logs.js';
import routes from './routes/index.js';
import { buildSwagger } from './libs/swagger.js';
import swaggerUi from 'swagger-ui-express';
const port = process.env.PORT ? +process.env.PORT : 4000;
const main = (port) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    const swaggerSpec = buildSwagger(port);
    if (swaggerSpec)
      app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(routes);
    app.listen(port);
    yield initLog(port);
  });
main(port);
