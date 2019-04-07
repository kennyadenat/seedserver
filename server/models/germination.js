const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosepaginator = require('mongoose-paginate-v2');
const AnalysisCount = require('../models/analysiscount');

const GerminationSchema = new Schema({
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
  normal: Number,
  abnormal: Number,
  hard: Number,
  dead: Number,
  germinationpercentage: Number,
  remarks: String,
  analysiscount: [{
    type: Schema.Types.ObjectId,
    ref: "Analysis"
  }],
  region: String,
  reportingofficer: String,
  dateevaluated: {
    type: Date
  },
  datetested: {
    type: Date
  },
  createdon: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    virtuals: true
  }
}, {
  timestamps: true
})


// GerminationSchema.virtual('members', {
//   ref: 'Analysis', // The model to use
//   localField: 'germinationid', // Find people where `localField`
//   foreignField: 'germinationid', // is equal to `foreignField`
//   // If `justOne` is true, 'members' will be a single doc as opposed to
//   // an array. `justOne` is false by default.
//   justOne: false,
//   options: {
//     sort: {
//       analysistype: -1
//     },
//     limit: 5
//   } // Query options, see http://bit.ly/mongoose-query-options
// });

GerminationSchema.plugin(mongoosepaginator);

module.exports = mongoose.model('Germination', GerminationSchema);