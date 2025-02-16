import { dirname } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);

export const buildSwagger = (port: number) => {
  const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'TDD MASTERCLASSS API',
        version: '1.3.0',
        description: 'A simple Express API',
      },
      servers: [
        {
          url: `http://localhost:${port}`, // API 서버의 기본 URL
        },
      ],
      schemas: {
        Content: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '036973b5-ff09-414d-9a2b-7347bf91ee26',
            },
            title: {
              type: 'string',
              example: 'Example Title',
            },
            body: {
              type: 'string',
              example: 'This is an example body of the content.',
            },
            thumbnail: {
              type: 'string',
              example: '/file.svg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-25T10:00:00.000Z',
            },
            authorId: {
              type: 'string',
              example: '4726b578-5427-4216-994a-f61ad2997d2b',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '036973b5-ff09-414d-9a2b-7347bf91ee26',
            },
            nickname: {
              type: 'string',
              example: 'dulee',
            },
            imgUrl: {
              type: 'string',
              example: '/globe.svg',
            },
          },
        },
        ContentView: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '036973b5-ff09-414d-9a2b-7347bf91ee26',
            },
            title: {
              type: 'string',
              example: 'Example Title',
            },
            body: {
              type: 'string',
              example: 'This is an example body of the content.',
            },
            thumbnail: {
              type: 'string',
              example: '/file.svg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-25T10:00:00.000Z',
            },
            author: {
              $ref: '#/schemas/User',
            },
          },
        },
      },
    },
    apis: [dir + '/../routes/*.js'], // API 파일 경로
  };

  return swaggerJSDoc(swaggerOptions);
};
