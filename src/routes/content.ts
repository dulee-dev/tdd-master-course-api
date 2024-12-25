import { contentTable } from '../db/contents.js';
import queryString from 'query-string';
import { userTable } from '../db/users.js';
import { omit } from 'radashi';
import { Content } from '../schema/content.entity.js';
import { User } from '../schema/user.entity.js';
import { Router } from 'express';
import { v4 } from 'uuid';

const router = Router();

const convertContentToContentView = (content: Content, user: User) => {
  return {
    ...omit(content, ['authorId']),
    author: user,
  };
};

/**
 * @swagger
 * /contents/count:
 *   get:
 *     summary: count by optional q
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                  type: number
 *                  example: 14
 *                 status:
 *                   type: number
 *                   example: 200
 */
router.get('/contents/count', (req, res) => {
  const url = req.url;

  const [, qString] = url.split('?');
  const query = queryString.parse(qString);
  const q = typeof query.q === 'string' ? query.q : undefined;

  if (!q) {
    res.json({
      count: contentTable.length,
      status: 200,
    });
    return;
  }
  res.json({
    count: contentTable.filter((c) => c.title.includes(q)).length,
    status: 200,
  });
  return;
});

/**
 * @swagger
 * /contents:
 *   get:
 *     summary: Get paginated and filtered content
 *     description: Retrieve a list of content with pagination, sorting, and optional search query.
 *     parameters:
 *       - in: query
 *         name: pageNum
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number (defaults to 1).
 *       - in: query
 *         name: pageTake
 *         schema:
 *           type: integer
 *           example: 12
 *         description: Number of items per page (defaults to 12).
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: "example title"
 *         description: Search query for filtering content by title.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [title-asc, createdAt-desc]
 *           example: createdAt-desc
 *         description: Sorting order. Defaults to `createdAt-desc`.
 *     responses:
 *       200:
 *         description: Successful response with content data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       title:
 *                         type: string
 *                         example: "Example Title"
 *                       body:
 *                         type: string
 *                         example: "This is the body of the content."
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/thumbnail.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-25T10:00:00.000Z"
 *                       authorId:
 *                         type: string
 *                         example: "67890"
 *                 status:
 *                   type: integer
 *                   example: 200
 */
router.get('/contents', (req, res) => {
  const url = req.url;
  const [, qString] = url.split('?');

  if (qString === undefined) {
    const contents = contentTable;
    res.json({
      contents: contents
        .sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        })
        .slice(0, 12),
      status: 200,
    });
    return;
  }
  const query = queryString.parse(qString);
  const pageNum = typeof query.pageNum === 'string' ? +query.pageNum : 1;
  const pageTake = typeof query.pageTake === 'string' ? +query.pageTake : 12;

  const startAt = (pageNum - 1) * pageTake;
  const endAt = pageNum * pageTake;

  const contents = contentTable;
  res.json({
    contents: contents
      .filter((c) =>
        typeof query.q !== 'string' ? true : c.title.includes(query.q)
      )
      .sort((a, b) => {
        if (query.sort === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
      .slice(startAt, endAt)
      .map((c) => convertContentToContentView(c, userTable[0])),
    status: 200,
  });
});

/**
 * @swagger
 * /contents/{id}:
 *   get:
 *     summary: Get content by ID
 *     description: Retrieve a specific content by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the content.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   $ref: '#/schemas/Content'
 *                 status:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Content not found.
 */
router.get('/contents/:id', (req, res) => {
  const id = req.params.id as string | undefined;

  const found = contentTable.find((c) => c.id === id);

  if (!found) {
    res.json({ status: 404 });
    return;
  }
  const user = userTable.find((c) => c.id === found.authorId);

  if (!user) {
    res.json({ status: 400 });
    return;
  }

  res.json({
    content: convertContentToContentView(found, user),
    status: 200,
  });
});

/**
 * @swagger
 * /users/me/contents/{id}:
 *   get:
 *     summary: Get user's specific content by ID
 *     description: Retrieve a specific content owned by the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's content.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   $ref: '#/schemas/Content'
 *                 status:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Content or user not found.
 */
router.get('/users/me/contents/:id', (req, res) => {
  const id = req.params.id as string | undefined;
  const auth = req.headers['authorization']; // 헤더 이름으로 값 가져오기

  const user = userTable.find((c) => c.nickname === auth);
  if (!user) {
    res.json({
      status: 404,
    });
    return;
  }

  const found = contentTable.find((c) => c.id === id && c.authorId === user.id);

  if (!found) {
    res.json({ status: 404 });
    return;
  }

  res.json({
    content: convertContentToContentView(found, user),
    status: 200,
  });
});

/**
 * @swagger
 * /contents:
 *   post:
 *     summary: Create a new content
 *     description: Allows authenticated users to create new content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *           example:
 *             title: "New Content"
 *             body: "This is a new content body."
 *             thumbnail: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Successfully created the content.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   $ref: '#/schemas/Content'
 *                 status:
 *                   type: integer
 *                   example: 201
 *       401:
 *         description: Unauthorized user.
 */
router.post('/contents', async (req, res) => {
  const auth = req.headers['authorization']; // 헤더 이름으로 값 가져오기

  const user = userTable.find((c) => c.nickname === auth);
  if (!user) {
    res.json({
      status: 401,
    });
    return;
  }

  const id = v4();
  const prototype = req.body as Omit<Content, 'id' | 'createdAt' | 'authorId'>;
  const content: Content = {
    id,
    ...prototype,
    authorId: user.id,
    createdAt: new Date(),
  };

  contentTable.push(content);

  res.json({
    content,
    status: 201,
  });
});

/**
 * @swagger
 * /contents/{id}:
 *   patch:
 *     summary: Update content
 *     description: Allows authenticated users to update their own content.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *           example:
 *             title: "Updated Content"
 *             body: "This is the updated content body."
 *             thumbnail: "https://example.com/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Successfully updated the content.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   $ref: '#/schemas/Content'
 *                 status:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Content or user not found.
 */
router.patch('/contents/:id', async (req, res) => {
  const id = req.params.id as string | undefined;
  const auth = req.headers['authorization']; // 헤더 이름으로 값 가져오기

  const user = userTable.find((c) => c.nickname === auth);
  if (!user) {
    res.json({
      status: 404,
    });
    return;
  }

  const found = contentTable.find((c) => c.id === id && c.authorId === user.id);
  if (!found) {
    res.json({
      status: 404,
    });
    return;
  }

  const body = req.body as Omit<Content, 'id' | 'createdAt' | 'authorId'>;

  const updated: Content = { ...found, ...body };

  const idx = contentTable.findIndex(
    (c) => c.id === id && c.authorId === user.id
  );
  if (idx !== -1) {
    contentTable[idx] = updated;
  }

  res.json({
    content: convertContentToContentView(updated, user),
    status: 200,
  });
});

/**
 * @swagger
 * /contents/{id}:
 *   delete:
 *     summary: Delete content
 *     description: Allows authenticated users to delete their own content.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the content.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Content or user not found.
 */
router.delete('/contents/:id', async (req, res) => {
  const id = req.params.id as string | undefined;
  const auth = req.headers['authorization']; // 헤더 이름으로 값 가져오기

  const user = userTable.find((c) => c.nickname === auth);
  if (!user) {
    res.json({
      status: 404,
    });
    return;
  }

  const found = contentTable.find((c) => c.id === id && c.authorId === user.id);
  if (!found) {
    res.json({
      status: 404,
    });
    return;
  }

  const idx = contentTable.findIndex(
    (c) => c.id === id && c.authorId === user.id
  );
  if (idx !== -1) {
    contentTable.splice(idx, 1);
  }

  res.json({
    status: 200,
  });
});

export default router;
