const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const TrackRecord = require('./trackrecord');
const Region = require('./region');
const Crop = require('./crop');
const moment = require('moment');

const SeedSchema = new Schema({
  id: {
    type: String
  },
  seedcompanyid: {
    type: String,
    required: true
  },
  region: {
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
  crop: {
    type: String,
    required: true
  },
  variety: {
    type: String,
    required: true
  },
  submittingofficer: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  },
  receivingofficer: {
    type: String,
    required: true
  },
  submittedsample: {
    type: Number,
    required: true
  },
  datereceived: {
    type: Date
  },
  createdon: {
    type: Date,
    default: Date.now
  },
  time: {
    type: String
  },
  isPurity: {
    type: Boolean,
    default: false
  },
  isGerm: {
    type: Boolean,
    default: false
  },
  puritykg: {
    type: String
  },
  purityper: {
    type: String
  },
  purityremarks: {
    type: String
  },
  normal: {
    type: String,
  },
  abnormal: {
    type: String,
  },
  hard: {
    type: String,
  },
  dead: {
    type: String,
  },
  germper: {
    type: String,
  },
  germremarks: {
    type: String,
  },
  refno: {
    type: String,
  }

}, {
  timestamps: true
})

SeedSchema.plugin(mongoosePaginate);

Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}

SeedSchema.statics.generatereference = async function (params, callback) {
  const options = {
    page: 1,
    limit: 10,
  };

  const _region = await Region.findOne({
    name: params.region
  }).exec();

  const _crop = await Crop.findOne({
    name: params.crop
  }).exec();

  const todayYear = new Date().getFullYear();
  const reference = _region.alias + "/" + todayYear + "/" + _crop.tag + "/";

  const _track = await TrackRecord.findOne({
    region: params.region
  }).exec();


  /* Calculates and Tracks the Reference 
  Number for the Seed Sample */
  const counts = _track;
  if (!_track) {
    // Means there isnt any one here. 
    const _counts = counts + 1;
    const tests = reference + _counts.pad(5);
    params.referenceno = tests;
    return updateTrack(params, _counts, _track);
  } else if (_track.count >= 1) {
    // Already exists. Just fetch the last id and add. . 
    const _counts = _track.count + 1;
    const tests = reference + _counts.pad(5);
    params.referenceno = tests;

    //Updates the Germination and Purity Set Date
    params.time = moment().add(_crop.time, 'd').format('YYYY-MM-DD');;
    return updateTrack(params, _counts, _track);
  }

}

function updateTrack(params, counts, _track) {
  const _seedSample = new SeedSample(params);

  const newSeedSample = _seedSample.save();
  if (newSeedSample) {
    if (!_track) {
      const _trackRecord = new TrackRecord({
        region: params.region,
        count: counts
      });
      _trackRecord.save();
    } else {
      TrackRecord.findOneAndUpdate({
        region: params.region
      }, {
        count: counts
      }, function (err) {
        if (err) return next(err);
      })
    }
  }
  return newSeedSample;
}

SeedSchema.virtual('formatDate').get(function () {
  // return this.createon;
  // return this.createon.toDateString();
  return moment(this.createdon).format('YYYY-MM-DD');
});

SeedSchema.virtual('title').get(function () {
  return this.source;
});

SeedSchema.virtual('url').get(function () {
  return this.referenceno;
});

SeedSchema.virtual('date').get(function () {
  return this.time;
});


const SeedSample = module.exports = mongoose.model('Seed', SeedSchema);