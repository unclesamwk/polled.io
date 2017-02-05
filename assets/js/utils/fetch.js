require('es6-promise').polyfill()
import fetchAPI from 'isomorphic-fetch'

import { dispatch } from './../index'
import { setMessage } from './../actions/message'


export default function (url, opts = {}) {
  let body = opts.body || null
  let headers = opts.headers || null
  let method = opts.method || 'GET'

  headers = Object.assign({}, headers, {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })

  let params = {
    headers,
    method
  }

  if (body) {
    params.body = JSON.stringify(body)
  }

  return fetchAPI(`/api/${ url }`, params).then(response => {
    return response.json().then(json => {
      return {
        response,
        status: response.status,
        data: json.data,
      }
    })
  }).then(res => {
    const { status, data } = res

    if (status === 500 || status === 400) {
      throw new Error(data.message)
    }

    if (status === 429) {
      const ttl = res.response.headers.get('X-RateLimit-Reset')
      const RateError = new Error()

      RateError.message = data.message
      RateError.ttl = ttl

      throw RateError
    }

    return data
  }).catch((error) => {
    dispatch(setMessage(error.message, error.ttl))
    throw new Error(error.message)
  })
}
