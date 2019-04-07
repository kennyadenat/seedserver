const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const AnalysisSchema = new Schema({
  germinationid: {
    type: Schema.Types.ObjectId,
    ref: 'Germination'
  },
  analysistype: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Analysis', AnalysisSchema);