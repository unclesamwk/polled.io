export const setMessage = (message, ttl) => ({
  type: 'SET_MESSAGE',
  message,
  ttl,
})

export const clearMessage = () => ({
  type: 'CLEAR_MESSAGE',
})
