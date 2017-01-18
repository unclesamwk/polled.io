import Promise from 'bluebird'
Promise.promisifyAll(require('mongoose'))

import pollModel from './../../models/poll'

import ApiError from './../../utils/api-error'
import * as msg from './../../utils/messages'


class Poll {
  async create (title, choices) {
    try {
      let uniqueUrl = false

      while (uniqueUrl === false) {
        const url = await this.generateUrl()
        const poll = await pollModel.findOne({ url })

        uniqueUrl = (poll) ? false : url
      }

      return await pollModel({ title, choices, url: uniqueUrl }).save()
    } catch (e) {
      throw new ApiError(
        500, 'Error: Poll:Create', e
      )
    }
  }

  async read (id) {
    try {
      const poll = await pollModel.findOne({ url: id }, '-date -__v')

      return poll
    } catch (e) {
      throw new ApiError(
        500, 'Error: Poll:Read', e
      )
    }
  }

  async vote (pollId, choiceId, unvoteId = '') {
    try {
      let unvoteUpdate

      if (unvoteId) {
        unvoteUpdate = await pollModel.update(
          {
            _id: pollId,
            choices: {
              $elemMatch: {
                _id: unvoteId,
                votes: { $gt: 0 }
              }
            }
          },
          { $inc: { 'choices.$.votes': -1 } }
        )
      }

      if (unvoteId && !unvoteUpdate.nModified) {
        throw new ApiError(400, msg.BAD_REQUEST)
      }

      await pollModel.update(
        { '_id': pollId, 'choices._id': choiceId },
        { $inc: { 'choices.$.votes': 1 } },
      )

      return await pollModel.findById(pollId)
    } catch (e) {
      throw new ApiError(
        e.code || 500,
        e.message || 'Error: Poll:Vote',
        e
      )
    }
  }

  async generateUrl () {
    const possible = 'abcdefghijklmnopqrstuvwxyz'
    let text = ''

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }
}


export default Poll
