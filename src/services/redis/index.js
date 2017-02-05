import redis from 'redis'
import Promise from 'bluebird'

Promise.promisifyAll(redis.RedisClient.prototype)

const url = process.env.REDISCLOUD_URL


class Redis {
  constructor () {
    const client = redis.createClient({ url, appendonly: false })

    client.on('error', err => {
      console.error(`Redis Error: ${ err }`)
    })

    this.client = client

    return client
  }
}


const redisConn = new Redis()


export default redisConn
