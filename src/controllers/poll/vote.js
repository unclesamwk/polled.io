import PollService from './../../services/poll'
const pollService = new PollService()

import apiResponse from './../../utils/api-response'
import ApiError from './../../utils/api-error'
import * as msg from './../../utils/messages'


const vote = async (req, res) => {
  const { poll_id, choice_id, unvote_id } = req.body

  if (!poll_id || !choice_id) throw new ApiError(400, msg.NO_ID)

  const poll = await pollService.vote(poll_id, choice_id, unvote_id)

  if (poll) req.SOCKETS.to(poll.url).emit('voted', poll)

  return apiResponse({
    data: { message: msg.OK },
    res,
  })
}


export default vote
