const express = require('express');

const retailerRouter = (controller, fileUploadMiddleware, authMiddlewear) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/retailers:
  *  post:
  *    description: Create retailer.
  *    tags:
  *     - Retailers
  *    parameters:
  *     - name: retailer
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Retailer'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/retailers:
   *  get:
   *    description: Get all retailers.
   *    tags:
   *      -  Retailers
   *    name: Retailers
   *    produces:
   *      -  application/json
   *    responses:
   *     '200':
   *      description: A list of all retailers
   *      content:
   *        application/json:
   *          schema:
   *            type: array
   *            items: object
   */
  router.get('/', async (req, res) => {
    const { statusCode, result } = await controller.index.action();
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/retailers/{id}:
  *  get:
  *    description: Get retailers by id.
  *    tags:
  *      -  Retailers
  *    name: Retailers
  *    produces:
  *      -  application/json
  *    parameters:
  *      - in: path
  *        name: id
  *    responses:
  *     '200':
  *      description: retailer with id
  *
  */
  router.get('/:id', async (req, res) => {
    const { statusCode, result } = await controller.show.action(req.params.id);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/retailers:
  *  put:
  *    description: update retailer.
  *    security:
  *      - bearerAuth: []
  *    tags:
  *     - Retailers
  *    parameters:
  *     - in: body
  *       name: retailer
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Retailer'
  *    responses:
  *     '200':
  *      description: successfully updated.
  */
  router.put('/', authMiddlewear, async (req, res) => {
    const { statusCode, result } = await controller.update.action(req.user.id, req.body);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/retailers/login:
  *  post:
  *    description: login retailer with OTP.
  *    tags:
  *     - Retailers
  *    parameters:
  *     - name: session
  *       in: body
  *       required: true
  *       schema:
  *         properties:
  *           phoneNumber:
  *             type: string
  *           otp:
  *             type: string
  *    responses:
  *     '200':
  *      description: Successfully logged in.
  */
  router.post('/login', async (req, res) => {
    const { statusCode, result } = await controller.login.action(req.body.phoneNumber,
      req.body.otp);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/retailers/otp:
  *  post:
  *    description: send user OTP code.
  *    tags:
  *     - Retailers
  *    parameters:
  *     - name: phone Number
  *       in: body
  *       required: true
  *       schema:
  *         properties:
  *           phoneNumber:
  *             type: string
  *    responses:
  *     '200':
  *      description: OTP succesfully sent.
  */
  router.post('/otp', async (req, res) => {
    const { statusCode, result } = await controller.generateAndSendOTP.action(req.body.phoneNumber);
    res.status(statusCode).json(result);
  });

  router.post('/profile_image', authMiddlewear, fileUploadMiddleware.single('profile_image'),
    async (req, res) => {
      const {
        statusCode, result,
      } = await controller.uploadProfileImage.action(req.user.id, req.file);
      res.status(statusCode).json(result);
    });

  return router;
};

module.exports = retailerRouter;
