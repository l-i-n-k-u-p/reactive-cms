const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ResourceModel = new Schema({
  resource_name: {
    type: String,
    trim: true,
    required: true,
  },
  resource_permission: {
    type: Array,
    required: true,
  },
  resource_role_ref: {
    type: Schema.Types.ObjectId,
    ref: 'role',
    required: true,
  },
}, {
  collection: 'resource',
})

ResourceModel.index({
  resource_name: true,
  resource_role_ref: true,
},
{
  unique: true,
})

ResourceModel.virtual('model_name').get(() => {
  return 'resource'
})

ResourceModel.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('ResourceModel', ResourceModel)
