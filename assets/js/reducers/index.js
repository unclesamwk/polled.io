import { combineReducers } from 'redux'
import { createForms } from 'react-redux-form'

import message from './message'


const createPollInitialState = {
  title: '',
  choices: ['', ''],
}

const pollInitialState = {
  _id: '',
  url: '',
  title: '',
  choices: [],
  isFetching: false,
}


export default combineReducers({
  message,

  ...createForms({
    createPoll: createPollInitialState,
    poll: pollInitialState,
  })
})
