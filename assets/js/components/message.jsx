import React, { Component } from 'react'


export class Message extends Component {
  constructor () {
    super()

    this.state = {
      seconds: 5000,
    }
  }

  componentDidMount () {
    const seconds = (this.props.message.ttl * 1000) || this.state.seconds

    this.setState({ seconds }, () => {
      this.interval = setInterval(() => {
        this.setState({
          seconds: this.state.seconds - 1000,
        })
      }, 1000)

      setTimeout(() => {
        this.props.clearMessage()
        clearInterval(this.interval)
      }, seconds)
    })
  }

  render () {
    return (
      <div className="message">
        { this.props.message.message }

        { this.props.message.ttl &&
          <span> — Please wait { this.state.seconds / 1000 } seconds.</span>
        }
      </div>
    )
  }
}

Message.displayName = 'Message'


export default Message
