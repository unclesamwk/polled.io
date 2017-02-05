import { actions as formActions } from 'react-redux-form'

import fetch from './../utils/fetch'
import * as poll from './poll'


export const addChoice = () => {
  return (dispatch) => {
    return dispatch(formActions.push('createPoll.choices', ''))
  }
}


export const removeChoice = (index) => {
  return (dispatch) => {
    return dispatch(formActions.remove('createPoll.choices', index))
  }
}


export const submit = (createPoll) => {
  return (dispatch) => {
    const { title, choices } = createPoll

    return fetch('poll', {
      method: 'POST',
      body: { title, choices },
    }).then((data = {}) => {
      if (!data.poll) {
        console.error('Error voting: ', data.error)
        return
      }

      dispatch(formActions.reset('createPoll'))

      return dispatch(poll.update(data.poll))
    })
  }
}
