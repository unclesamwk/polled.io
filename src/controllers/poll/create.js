import PollService from './../../services/poll'
const pollService = new PollService()

import apiResponse from './../../utils/api-response'
import ApiError from './../../utils/api-error'
import * as msg from './../../utils/messages'


const create = async (req, res) => {
  let { title, choices } = req.body

  if (!title) throw new ApiError(400, msg.NO_TITLE)
  if (!choices) throw new ApiError(400, msg.NO_CHOICES)

  const poll = await pollService.create(title, choices)

  return apiResponse({
    data: {
      message: msg.OK,
      poll,
    },
    res,
  })
}


export default create

