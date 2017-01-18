import PollService from './../../services/poll'
const pollService = new PollService()

import apiResponse from './../../utils/api-response'
import ApiError from './../../utils/api-error'
import * as msg from './../../utils/messages'


const read = async (req, res) => {
  const { id } = req.params

  if (!id) throw new ApiError(400, msg.NO_ID)

  const poll = await pollService.read(id)

  if (!poll) {
    return apiResponse({
      data: { message: msg.NO_RESULTS },
      status: 404,
      res,
    })
  }

  return apiResponse({
    data: { message: msg.OK, poll },
    res,
  })
}


export default read
