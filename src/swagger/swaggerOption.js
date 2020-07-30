const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOption = {
  swaggerDefinition: {
    info: {
      title: 'Garhia API Documentation',
      description: 'API documentations for garhia application',
      version: '1.0.0',
      contact: {
        name: 'garhia developer',
        email: 'dev@garhia.com',
      },
      server: [
        {
          url: 'http:localhost:5000',
        },
      ],
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
  apis: ['./src/routers/*.js', './src/data_access/schemas/*.js'],
};

module.exports = swaggerJsDoc(swaggerOption);
