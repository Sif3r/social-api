const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express')
require('dotenv').config();
const logger = require('morgan')

const app = express()

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      { url: 'https://social-api-cvd9b5dmbmacfrcu.francecentral-01.azurewebsites.net/' },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);


app.use(express.json());
app.use(logger('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const fs = require('fs');
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerDocs));

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/login', require('./routes/auth'));
app.use('/user', require('./routes/user'))
app.use('/post', require('./routes/post'))
app.use('/media', require('./routes/media'));

module.exports = app
