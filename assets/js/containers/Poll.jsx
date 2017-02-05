import React, { Component } from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import { get, reset, update, vote, unvote } from './../actions/poll'

import { calculateColors, colors } from './../utils/colors'


export class Poll extends Component {
  constructor () {
    super()

    this.state = {
      activeChoice: null,
      calculatedColors: [],
    }
  }

  componentDidMount () {
    const socket = io.connect()
    const { url } = this.props.params

    socket.on('connect', () => {
      socket.emit('join', url)
    })

    socket.on('voted', (data) => {
      this.props.update(data)
    })

    if (this.props.poll.url) {
      this.setState({
        calculatedColors: calculateColors(colors, this.props.poll.choices)
      })
    } else {
      this.props.get(url).then(() => {
        this.setState({
          calculatedColors: calculateColors(colors, this.props.poll.choices)
        })
      })
    }
  }

  componentWillUnmount () {
    this.props.reset()
  }

  render () {
    const { poll } = this.props
    const { calculatedColors } = this.state

    const totalVotes = poll.choices.reduce((a, v) => a + v.votes, 0)

    return (
      <div>
        { !poll.isFetching && poll._id &&
          <div>
            <h1 className="poll-title">{ poll.title }</h1>
            { poll.choices.map((v, k) => {
              const width = (totalVotes) ? (v.votes / totalVotes) * 100 : 0

              return (
                <div key={ k } className="choice">
                  <input
                    onChange={ this.handleVote }
                    type="radio"
                    name="choice"
                    value={ k } />

                  <p className="choice-title">
                    { v.title } — (<strong>{ v.votes }</strong>)
                  </p>

                  <div className="bar"
                    style={{
                      width: `${ width }%`,
                      background: colors[calculatedColors[k]]
                    }}>
                  </div>
                  <div className="bar-shadow"></div>
                </div>
              )
            }) }
          </div>
        }

        { !poll.isFetching && !poll._id &&
            <p className="quote">
              “The truth is that the heroism of your childhood entertainments
              was not true valor. It was theatre. The grand gesture, the moment
              of choice, the mortal danger, the external foe, the climactic battle
              whose outcome resolves all--all designed to appear heroic, to excite
              and gratify and audience. Gentlemen, welcome to the world of reality--there
              is no audience. No one to applaud, to admire. No one to see you.
              Do you understand? Here is the truth--actual heroism receives no
              ovation, entertains no one. No one queues up to see it. No one is interested.”
            </p>
        }

        { poll.isFetching &&
            <h1 className="spinner">❍</h1>
        }
      </div>
    )
  }

  handleVote = (e) => {
    const { value } = e.target
    const { poll } = this.props
    const { activeChoice } = this.state
    const activeChoiceId =
      poll.choices[activeChoice] ? poll.choices[activeChoice]._id : ''

    if (activeChoice === value) {
      return
    }

    this.props.vote(
      poll._id,
      poll.choices[value]._id,
      activeChoiceId,
    )

    this.setState({ activeChoice: value })
  }
}

Poll.displayName = 'Poll'

const mapStateToProps = (state) => ({
  poll: state.poll,
})

const mapDispatchToProps = {
  get,
  update,
  vote,
  unvote,
  reset,
}


export default connect(mapStateToProps, mapDispatchToProps)(Poll)
