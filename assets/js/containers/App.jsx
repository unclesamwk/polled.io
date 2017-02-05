import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Message from './../components/message'

import { clearMessage } from './../actions/message'


export class App extends Component {
  render () {
    const { message, clearMessage } = this.props

    return (
      <div className="container">
        { message.message &&
          <Message message={ message } clearMessage={ clearMessage } />
        }

        <Link className="title" to={ '/' }>Polled</Link>

        { this.props.children }

        <footer>
          <a href="https://github.com/tomspeak/polled.io">Source code</a>
        </footer>
      </div>
    )
  }
}

App.displayName = 'App'

const mapStateToProps = (state) => ({
  message: state.message,
})

const mapDispatchToProps = {
  clearMessage,
}


export default connect(mapStateToProps, mapDispatchToProps)(App)
