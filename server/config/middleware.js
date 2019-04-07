const csvFilePath = './public/crop.csv'
const csv = require('csvtojson/v2');
csv({
    noheader: false,
    headers: ['_id', 'name', 'germpass', 'purpass', 'time']
  })
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    console.log(jsonObj);

    Crop.collection.insert(jsonObj, function (err, doc) {
      console.log(doc);
    })
  })



const csvFilePathv = './public/variety.csv'
const csvv = require('csvtojson/v2');
csvv({
    noheader: false,
    headers: ['_id', 'cropid', 'name', 'cropname']
  })
  .fromFile(csvFilePathv)
  .then((jsonObj) => {
    console.log(jsonObj.length);

    Variety.collection.insert(jsonObj, function (err, doc) {
      console.log(doc);
    })

  })



const State = require('./models/state');
const csvFilePath = './public/states.csv';
const csv = require('csvtojson/v2');
csv({
    noheader: false,
    headers: ['name']
  })
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    console.log(jsonObj);

    State.collection.insert(jsonObj, function (err, doc) {
      console.log(doc);
    })
  })