import Mongoose, { Schema } from 'mongoose'


const PollSchema = new Schema({
  title: { type: String, trim: true, required: true },
  choices: [
    {
      title: { type: String, trim: true, required: true },
      votes: { type: Number, default: 0, min: 0 },
    }
  ],
  date: { type: Date, default: Date.now },
  url: { type: String, required: true, unique: true },
})


PollSchema.pre('save', function (next) {
  this.title = this.title.substr(0, 100)

  this.choices = this.choices.filter(Boolean).slice(0, 10).map((v) => {
    if (v.title) {
      return {
        title: v.title.substr(0, 100)
      }
    }
  })

  next()
})


export default Mongoose.model('Poll', PollSchema)
