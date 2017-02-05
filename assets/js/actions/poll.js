import { actions as formActions } from 'react-redux-form'

import fetch from './../utils/fetch'


export function get (url) {
  return (dispatch) => {
    dispatch(formActions.change('poll.isFetching', true))

    return fetch(`poll/${ url }`)
      .then((data = {}) =>  {
        dispatch(formActions.change('poll.isFetching', false))
        if (data.poll) return dispatch(update(data.poll))
      })
  }
}


export function reset () {
  return (dispatch) => {
    return dispatch(formActions.reset('poll'))
  }
}


export function vote (pollId, choiceId, unvoteId) {
  return () => {
    return fetch('poll/vote', {
      method: 'PATCH',
      body: {
        'poll_id': pollId,
        'choice_id': choiceId,
        'unvote_id': unvoteId,
      },
    })
  }
}


export function update (poll) {
  return (dispatch) => {
    return dispatch(formActions.load('poll', poll))
  }
}
