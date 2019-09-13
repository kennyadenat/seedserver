exports.Crops = function () {
  const csvFilePath = './public/crop.csv'
  const csv = require('csvtojson/v2');
  const Crop = require('./models/crop');
  csv({
      noheader: false,
      headers: ['id', 'name', 'germpass', 'purpass', 'time']
    })
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      console.log(jsonObj);

      Crop.collection.insert(jsonObj, function (err, doc) {
        console.log(doc);
      })
    })
}


exports.Variety = function () {
  const csvFilePathv = './public/variety.csv'
  const csvv = require('csvtojson/v2');
  const Variety = require('./models/variety');
  csvv({
      noheader: false,
      headers: ['id', 'cropid', 'name', 'cropname']
    })
    .fromFile(csvFilePathv)
    .then((jsonObj) => {
      console.log(jsonObj.length);

      Variety.collection.insert(jsonObj, function (err, doc) {
        console.log(doc);
      })

    })
}

exports.States = function () {
  // const State = require('./models/state');
  const csvFilePath = './public/states.csv';
  const csv = require('csvtojson/v2');
  csv({
      noheader: false,
      headers: ['name']
    })
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      console.log(jsonObj);

      // State.collection.insert(jsonObj, function (err, doc) {
      //   console.log(doc);
      // })
    })
}



// const _ = require('underscore')
// const Coy = require('./models/seedcompany');

// async function getCoy() {
//   const _coy = await Coy.find().exec();
//   // console.log(_coy);
//   //Formats the results based on the date
//   var views = _
//     .chain(_coy)
//     .groupBy('state')
//     .map(function (value, key) {
//       return {
//         state: key,
//         counts: value.length,
//       }
//     })
//     .value();

//   var dates = _
//     .chain(_coy)
//     .groupBy('formatDate')
//     .map(function (value, key) {
//       return {
//         date: key,
//         total: value.length
//       }
//     })
//     .value();

//   console.log(dates);
// }