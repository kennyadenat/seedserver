const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VarietySchema = new Schema({
  _id: {
    type: String
  },
  cropid: {
    type: String
  },
  name: {
    type: String
  },
  cropname: {
    type: String
  }
})

module.exports = mongoose.model('Variety', VarietySchema)