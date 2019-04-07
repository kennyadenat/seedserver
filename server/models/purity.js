const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginator = require('mongoose-paginate-v2');

const PuritySchema = new Schema({
  id: {
    type: String
  },
  seedsampleid: {
    type: String,
    required: true
  },
  referenceno: {
    type: String,
    required: true
  },
  lotno: {
    type: String,
    required: true
  },
  crop: {
    type: String,
    required: true
  },
  variety: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  seedclass: {
    type: String,
    required: true
  },
  purityscorekg: {
    type: Number,
    required: true
  },
  purityscoreper: {
    type: Number,
    required: true
  },
  innertscorekg: {
    type: Number,
    required: true
  },
  innertscoreper: {
    type: Number,
    required: true
  },
  region: String,
  remarks: String,
  reportingofficer: String,
  dateevaluated: {
    type: Date
  },
  datetested: {
    type: Date
  },
  createon: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

PuritySchema.plugin(mongoosePaginator);

module.exports = mongoose.model('Purity', PuritySchema)