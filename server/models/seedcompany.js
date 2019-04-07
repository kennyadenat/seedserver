const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const CompanySchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  reportingofficer: {
    type: String,
    required: true
  },
  regionalhead: {
    type: String,
    required: true
  },
  createon: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

CompanySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Company', CompanySchema);