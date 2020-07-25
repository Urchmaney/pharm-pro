const express = require('express');

const wholesalerRouter = (controller, fileUploadMiddleware) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/wholesalers:
   *  get:
   *    description: Get all wholesalers.
   *    tags:
   *      -  Wholesalers
   *    name: Wholesalers
   *    produces:
   *      -  application/json
   *    responses:
   *     '200':
   *      description: A list of all wholesalers
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
  * /api/wholesalers/{id}:
  *  get:
  *    description: Get wholesalers by id.
  *    tags:
  *      -  Wholesalers
  *    name: Wholesalers
  *    produces:
  *      -  application/json
  *    parameters:
  *      - in: path
  *        name: id
  *    responses:
  *     '200':
  *      description: wholesaler with id
  *
  */
  router.get('/:id', async (req, res) => {
    const { statusCode, result } = await controller.show.action(req.params.id);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/wholesalers:
  *  post:
  *    description: Create wholesaler.
  *    tags:
  *     - Wholesalers
  *    parameters:
  *     - name: wholesaler
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Wholesaler'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  router.put('/:id', async (req, res) => {
    const { statusCode, result } = await controller.update.action(req.params.id, req.body);
    res.status(statusCode).json(result);
  });

  router.delete('/:id', async (req, res) => {
    const { statusCode, result } = await controller.deleteAction.action(req.params.id);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/wholesalers/login:
  *  post:
  *    description: login wholesaler with OTP.
  *    tags:
  *     - Wholesalers
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
  * /api/wholesalers/otp:
  *  post:
  *    description: send user OTP code.
  *    tags:
  *     - Wholesalers
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

  /**
  * @swagger
  * /api/wholesalers/profile_image:
  *  post:
  *    description: upload profile image.
  *    tags:
  *     - Wholesalers
  *    consumes:
  *      - multipart/form-data
  *    parameters:
  *     - name: profile_image
  *       in: formData
  *       type: file
  *       decription: profile image to upload.
  *       required: true
  *    responses:
  *     '200':
  *      description: successfully upload profile image.
  */
  router.post('/profile_image', fileUploadMiddleware.single('profile_image'),
    async (req, res) => {
      const {
        statusCode, result,
      } = await controller.uploadProfileImage.action(req.file);
      res.status(statusCode).json(result);
    });

  return router;
};

module.exports = wholesalerRouter;
