const express = require('express')
const logger = require('morgan')

const app = express()

app.use(express.json());
app.use(logger('dev'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(require('./middlewares/session'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/', require('./routes/auth'))
app.use('/user', require('./routes/user'))
app.use('/product', require('./routes/product'))

module.exports = app
