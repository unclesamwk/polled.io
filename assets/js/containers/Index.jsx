import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Control, Form } from 'react-redux-form'

import {
  addChoice,
  removeChoice,
  submit
} from './../actions/create'

import { MIN_INPUT, MAX_INPUT } from './../config'


export class Index extends Component {
  componentWillReceiveProps (props) {
    if (props.poll.url) {
      this.props.router.push(props.poll.url)
    }
  }

  render () {
    const { createPoll, form } = this.props

    return (
      <Form
        model="createPoll"
        onSubmit={ (createPoll) => this.handleSubmit(createPoll) }
        validators={{
          title: (value) => value && value.length,
          choices: (value) => value && value.filter(v => v.title).length >= 2,
        }}>
        <Control.text
          model=".title"
          className="title-input"
          autoFocus
          placeholder="Title"
          maxLength="100" />

        { createPoll.choices.map((v, k) => {
          return (
            <Control.text
              model={ `.choices[${ k }].title` }
              maxLength="100"
              className="choice-input"
              key={ k }
              onFocus={ this.handleChoiceFocus.bind(this, k) }
              onKeyDown={ this.handleChoiceKeyDown.bind(this, k) } />
          )
        }) }

        <button
          type="submit"
          className="button"
          disabled={ !form.valid }>
            Create
        </button>
      </Form>
    )
  }

  /**
    * When focusing the last input field, if there are less than
    * MAX_INPUT, an input will be appended.
    */
  handleChoiceFocus = (index, e) => {
    const { choices } = this.props.createPoll,
          choicesLength = choices.length

    if (
      index !== (choicesLength - 1) ||
      choicesLength >= MAX_INPUT
    ) return false

    this.props.addChoice(index, choicesLength)
  }

  /**
    * Checks to see if the user has pressed `backspace`
    * whilst the input value is empty and deleting an input
    * would still satisfy the MIN_INPUT.
    */
  handleChoiceKeyDown = (index, e) => {
    const { choices } = this.props.createPoll

    if (
      e.keyCode === 8 &&
      choices[index].title === '' &&
      choices.length > MIN_INPUT
    ) {
      return this.props.removeChoice(index)
    }
  }

  handleSubmit = (createPoll) => {
    this.props.submit(createPoll)
  }
}

Index.displayName = 'Index'

const mapStateToProps = (state) => ({
  form: state.forms.createPoll.$form,
  createPoll: state.createPoll,
  poll: state.poll,
})

const mapDispatchToProps = {
  addChoice,
  removeChoice,
  submit,
}


export default connect(mapStateToProps, mapDispatchToProps)(Index)
