import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import reducer from './reducers/index'

const initialState = { }

const middleware = [thunk]

if (process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger'),
        logger = createLogger()

  middleware.push(logger)
}

function configureStore () {
  const store = createStore(
    reducer,
    initialState,
    compose (
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  return store
}

export default configureStore()
