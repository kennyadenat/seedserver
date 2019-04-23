const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const keys = require('./config/key');
const cors = require('cors');


const _ = require('underscore')
const Coy = require('./models/seedcompany');

async function getCoy() {
  const _coy = await Coy.find().exec();
  // console.log(_coy);
  //Formats the results based on the date
  var views = _
    .chain(_coy)
    .groupBy('state')
    .map(function (value, key) {
      return {
        state: key,
        counts: value.length,
      }
    })
    .value();

  var dates = _
    .chain(_coy)
    .groupBy('formatDate')
    .map(function (value, key) {
      return {
        date: key,
        total: value.length
      }
    })
    .value();

  console.log(dates);
}
// import {
//   makeExecutableSchema,
//   addMockFunctionsToSchema,
//   mergeSchemas
// } from 'graphql-tools';
const mergeSchemas = require('graphql-tools').mergeSchemas;


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//Get the Model Schema
const userSchema = require('./graphql/userchema');
const regionSchema = require('./graphql/regionschema');
const companySchema = require('./graphql/companyschema');
const germinationSchema = require('./graphql/germinationschema');
const puritySchema = require('./graphql/purityschema');
const cropSchema = require('./graphql/cropschema');
const stateSchema = require('./graphql/stateSchema');
const varietySchema = require('./graphql/varietyschema');
const sampleSchema = require('./graphql/seedschema');
const seedclassSchema = require('./graphql/seedclassSchema');
const analysisSchema = require('./graphql/analysisSchema');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', cors());

const allSchema = mergeSchemas({
  schemas: [
    stateSchema,
    cropSchema,
    regionSchema,
    userSchema,
    companySchema,
    puritySchema,
    varietySchema,
    sampleSchema,
    seedclassSchema,
    germinationSchema,
    analysisSchema
  ]
});

//Graphql Url
app.use('/nasc', cors(), graphqlHTTP({
  schema: allSchema,
  rootValue: global,
  graphiql: true
}));

//Mongoose Connection Setup
mongoose.connect(keys.mongobb.prod, {
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true
  })
  .then(() => console.log('Connection Successful'))
  .catch((err) => console.log(err));


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;