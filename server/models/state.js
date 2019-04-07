const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StateSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  }
})

module.exports = mongoose.model('state', StateSchema);