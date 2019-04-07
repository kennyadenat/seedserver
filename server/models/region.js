const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegionSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  alias: {
    type: String
  },
  state: {
    type: String
  },
  regionalhead: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Region', RegionSchema);