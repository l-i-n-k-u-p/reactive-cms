const mongoose = require('mongoose')
const Schema = mongoose.Schema


const LogModel = new Schema({
  log_model: {
    type: String,
    required: true,
  },
  log_operation: {
    type: String,
    required: true
  },
  log_operation_data: {
    type: Object,
    required: true,
  },
  log_user_ref: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  log_date: {
    type: String,
    required: true,
  },
}, {
  collection: 'log'
})

LogModel.virtual('model_name').get(() => {
  return 'log'
})

LogModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('LogModel', LogModel)
