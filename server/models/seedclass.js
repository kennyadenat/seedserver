const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


const SeedClassSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  }
})

SeedClassSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('SeedClass', SeedClassSchema);