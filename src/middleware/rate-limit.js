import Redis from './../services/redis'

import apiResponse from './../utils/api-response'
import * as msg from './../utils/messages'


const rateLimit = async(req, res, next) => {
  const { ip } = req

  res.set('X-RateLimit-Limit', 10)

  const cached = await Redis.getAsync(ip)

  if (!cached) {
    await Redis.setAsync(ip, 10, 'ex', 60)

    res.set('X-RateLimit-Remaining', 10)

    return next()
  }

  if (cached <= 0) {
    const ttl = await Redis.ttlAsync(ip)

    res.set('X-RateLimit-Remaining', 0)
    res.set('X-RateLimit-Reset', ttl)

    return apiResponse({
      data: {
        message: msg.RATE_LIMIT,
      },
      status: 429,
      res,
    })
  }

  const limit = await Redis.decrAsync(ip)

  res.set('X-RateLimit-Remaining', limit)

  next()
}


export default rateLimit
