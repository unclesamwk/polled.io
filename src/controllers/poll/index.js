import express from 'express'
let poll = express.Router()

import rateLimit from './../../middleware/rate-limit'

import read from './read'
import create from './create'
import vote from './vote'


poll.patch('/poll/vote', rateLimit, vote)
poll.post('/poll', rateLimit, create)

poll.get('/poll/:id', read)


export default poll
