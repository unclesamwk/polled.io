import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import mongoose from 'mongoose'
mongoose.Promise = require('bluebird')

import apiResponse from './utils/api-response'
import * as msg from './utils/messages'

const app = express()
const port = process.env.PORT || 5000
const dbUrl = process.env.DB_URL


app.db = mongoose.connect(dbUrl, (err) => {
  if (err) console.error('Error connecting to database: ', err)
})


app.use(bodyParser.json())
app.use(helmet())
app.use(compression())


app.use(express.static(path.join(__dirname, '../public')))
app.set('view engine', 'ejs')


app.use((req, res, next) => {
  process.on('unhandledRejection', reason => {
    const { code, message, e } = reason

    console.error(`Code: ${ code }`)
    console.error(`Message: ${ message }`)
    console.error(e)
    console.error('-----------------------')

    if (code === 500) {
      return apiResponse({
        status: code,
        data: {
          message: msg.SERVER_ERROR,
        },
        res
      })
    }

    if (code && message) {
      return apiResponse({
        status: code,
        data: {
          message,
        },
        res
      })
    }
  })

  next()
})



app.use((req, res, next) => {
  req.SOCKETS = io.sockets
  next()
})
app.use('/api', require('./controllers/poll/index'))
app.get('*', (req, res) => {
  return res.render('index')
})


const server = app.listen(port, () => console.log('Polled', server.address()))


const io = require('socket.io')(server)

io.sockets.on('connection', (socket) => {
  socket.on('join', poll => socket.join(poll) )
})
