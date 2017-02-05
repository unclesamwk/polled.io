import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'

import store from './store'

import App from './containers/App.jsx'
import Index from './containers/Index.jsx'
import Poll from './containers/Poll.jsx'
import NotFound from './containers/NotFound.jsx'

require('../css/app.css')

render (
  <Provider store={ store }>
    <Router history={ browserHistory }>
      <Route path='/' component={ App }>
        <IndexRoute component={ Index } />
        <Route path='/:url' component={ Poll } />
      </Route>
      <Route path="*" component={ NotFound } />
    </Router>
  </Provider>, document.getElementById('app')
)

export const dispatch = store.dispatch
