const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginator = require('mongoose-paginate-v2');

const CropSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  germpass: {
    type: Number
  },
  purpass: {
    type: Number
  },
  time: {
    type: Number
  },
  tag: {
    type: String
  },
  variety: {
    type: Schema.Types.ObjectId,
    ref: 'Variety'
  }
}, {
  timestamps: true
})

CropSchema.plugin(mongoosePaginator);

module.exports = mongoose.model('Crop', CropSchema)