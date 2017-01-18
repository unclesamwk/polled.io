const initialState = {
  message: '',
  ttl: 0,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_MESSAGE':
      return Object.assign({}, state, {
        message: action.message,
        ttl: action.ttl,
      })

    case 'CLEAR_MESSAGE':
      return initialState

    default:
      return state
  }
}
