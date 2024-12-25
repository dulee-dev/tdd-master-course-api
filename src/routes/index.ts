import { Router } from 'express';
import contentRoutes from './content.js';

const router = Router();

// 라우트 등록

router.use(contentRoutes);
router.use('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TDD MASTERCLASS API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f9;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          text-align: center;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        a {
          text-decoration: none;
          color: #007bff;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>TDD MASTERCLASS</h1>
        <h2>API Server</h2>
        <p><a href="/api">Swagger</a> to get started.</p>
      </div>
    </body>
    </html>
  `);
  return;
});

export default router;
