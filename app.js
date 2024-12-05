const express = require('express')
require('dotenv').config();
const logger = require('morgan')

const app = express()

app.use(express.json());
app.use(logger('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/login', require('./routes/auth'));
app.use('/user', require('./routes/user'))
app.use('/post', require('./routes/post'))

module.exports = app
