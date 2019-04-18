const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const moment = require('moment');

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
    default: Date
  }
}, {
  timestamps: true
})

CompanySchema.plugin(mongoosePaginate);

CompanySchema.virtual('formatDate').get(function () {
  // return this.createon;
  // return this.createon.toDateString();
  return moment(this.createon).format('YYYY-MM-DD');
})

module.exports = mongoose.model('Company', CompanySchema);