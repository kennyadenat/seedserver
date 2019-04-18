const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const IssuesSchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  }
});