const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({

});

module.exports = mongoose.model('Organization', OrganizationSchema);