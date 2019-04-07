const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const TrackRecordSchema = new Schema({
  item: {
    type: String
  },
  region: {
    type: String
  },
  count: {
    type: Number
  }
}, {
  timestamps: true
})

TrackRecordSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('TrackRecord', TrackRecordSchema);