const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLBoolean = require('graphql').GraphQLBoolean;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLDate = require('graphql-date');
const Seed = require('../models/seedsample');
const _ = require('underscore');
const mongoose = require('mongoose');
const moment = require('moment');



const seedType = new GraphQLObjectType({
  name: 'Seeds',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      seedcompanyid: {
        type: GraphQLString
      },
      region: {
        type: GraphQLString
      },
      referenceno: {
        type: GraphQLString
      },
      lotno: {
        type: GraphQLString
      },
      source: {
        type: GraphQLString
      },
      contact: {
        type: GraphQLString
      },
      seedclass: {
        type: GraphQLString
      },
      crop: {
        type: GraphQLString
      },
      variety: {
        type: GraphQLString
      },
      submittingofficer: {
        type: GraphQLString
      },
      remarks: {
        type: GraphQLString
      },
      receivingofficer: {
        type: GraphQLString
      },
      submittedsample: {
        type: GraphQLInt
      },
      datereceived: {
        type: GraphQLDate
      },
      createdon: {
        type: GraphQLDate
      },
      time: {
        type: GraphQLString
      },
      isPurity: {
        type: GraphQLBoolean
      },
      isGerm: {
        type: GraphQLBoolean
      },
      puritykg: {
        type: GraphQLString
      },
      purityper: {
        type: GraphQLString
      },
      purityremarks: {
        type: GraphQLString
      },
      normal: {
        type: GraphQLString
      },
      abnormal: {
        type: GraphQLString
      },
      hard: {
        type: GraphQLString
      },
      dead: {
        type: GraphQLString
      },
      germper: {
        type: GraphQLString
      },
      germremarks: {
        type: GraphQLString
      }
    }
  }
})

const calendarType = new GraphQLObjectType({
  name: 'SeedCalendar',
  fields: function () {
    return {
      url: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      date: {
        type: GraphQLString
      }
    }
  }
})


const seedList = new GraphQLObjectType({
  name: 'SeedList',
  fields: function () {
    return {
      docs: {
        type: new GraphQLList(seedType)
      },
      totalDocs: {
        type: GraphQLString
      },
      limit: {
        type: GraphQLString
      },
      page: {
        type: GraphQLString
      },
      totalPages: {
        type: GraphQLString
      },
      hasNextPage: {
        type: GraphQLBoolean
      },
      nextPage: {
        type: GraphQLString
      },
      hasPrevPage: {
        type: GraphQLBoolean
      },
      prevPage: {
        type: GraphQLString
      },
      pagingCounter: {
        type: GraphQLString
      }
    }
  }
})

/* Defines the GraphQLObjectType for the Company State Data */
const dataSampleCrop = new GraphQLObjectType({
  name: 'dataSampleCrop',
  fields: function () {
    return {
      crop: {
        type: GraphQLString
      },
      total: {
        type: GraphQLString
      },
      percent: {
        type: GraphQLString
      }
    }
  }
})

/* Defines the GraphQLObjectType for the Company State Data */
const dataSampleDate = new GraphQLObjectType({
  name: 'dataSampleDate',
  fields: function () {
    return {
      date: {
        type: GraphQLString
      },
      total: {
        type: GraphQLString
      },
      percent: {
        type: GraphQLString
      }
    }
  }
})

const dataSampleClass = new GraphQLObjectType({
  name: 'dataSampleClass',
  fields: function () {
    return {
      class: {
        type: GraphQLString
      },
      total: {
        type: GraphQLString
      },
      percent: {
        type: GraphQLString
      }
    }
  }
})


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      allseeds: {
        type: seedList,
        args: {
          id: {
            type: GraphQLString
          },
          limit: {
            type: GraphQLInt
          },
          page: {
            type: GraphQLInt
          },
          search: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          // const _sseeds = await Seed.findOne({
          //   referenceno: 'SWZ/2019/RR/00019'
          // }).exec();

          // console.log(_sseeds.formatDate);

          const options = {
            page: params.page,
            limit: params.limit,
            sort: {
              createon: -1
            }
          };

          console.log(params);
          if (params.search) {
            // Check if params.id is null or empty to determine the query type
            return Seed.paginate({
              region: params.id,
              referenceno: {
                $regex: new RegExp("^" + params.search.toLowerCase(), "i")
              }
            }, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          } else {
            // Check if params.id is null or empty to determine the query type
            return Seed.paginate({
              region: params.id
            }, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          }
        }
      },
      adminseeds: {
        type: seedList,
        args: {
          id: {
            type: GraphQLString
          },
          limit: {
            type: GraphQLInt
          },
          page: {
            type: GraphQLInt
          },
          search: {
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const options = {
            page: params.page,
            limit: params.limit,
            sort: {
              createon: -1
            }
          };

          // Check if params.id is null or empty to determine the query type
          return Seed.paginate({}, options, function (err, resp) {
            if (err) return next(err);
            return resp;
          });
        }
      },
      seeds: {
        type: seedList,
        args: {
          id: {
            type: GraphQLString
          },
          limit: {
            type: GraphQLInt
          },
          page: {
            type: GraphQLInt
          },
          search: {
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const options = {
            page: params.page,
            limit: params.limit,
            sort: {
              createon: -1
            }
          };

          // Check if params.id is null or empty to determine the query type
          return Seed.paginate({
            seedcompanyid: params.id
          }, options, function (err, resp) {
            if (err) return next(err);
            return resp;
          });
        }
      },
      seed: {
        type: seedType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          // const _seed = await Seed.findById(params.id).exec();        
          return Seed.findOne({
            referenceno: params.id
          }, function (err) {
            if (err) return next(err);
          })

        }
      },
      oneseed: {
        type: seedType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          // const _seed = await Seed.findById(params.id).exec();          
          return Seed.findOne({
            _id: params.id
          }, function (err) {
            if (err) return next(err);
          })

        }
      },
      searchseed: {
        type: seedType,
        args: {
          search: {
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          console.log(params);
          return Seed.findOne({
            referenceno: params.search
          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      dataSampleCrop: {
        type: new GraphQLList(dataSampleCrop),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          var _seed = null;

          if (params.id == 'All Regions') {
            _seed = await Seed.find({}).exec();
          } else {
            _seed = await Seed.find({
              region: params.id
            }).exec();
          }

          const views = _
            .chain(_seed)
            .groupBy('crop')
            .map(function (value, key) {
              return {
                crop: key,
                total: value.length
              }
            })
            .value();
          return views;
        }
      },
      dataSampleClass: {
        type: new GraphQLList(dataSampleClass),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          var _seed = null;
          if (params.id == 'All Regions') {
            _seed = await Seed.find({}).exec();
          } else {
            _seed = await Seed.find({
              region: params.id
            }).exec();
          }

          const views = _
            .chain(_seed)
            .groupBy('seedclass')
            .map(function (value, key) {
              return {
                class: key,
                total: value.length,
                percent: (value.length / _seed.length) * 100
              }
            })
            .value();

          console.log(views);
          return views;


        }
      },
      dataSampleDate: {
        type: new GraphQLList(dataSampleDate),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          var _seed = null;
          if (params.id == 'All Regions') {
            _seed = await Seed.find({}).exec();
          } else {
            _seed = await Seed.find({
              region: params.id
            }).exec();
          }

          const dates = _
            .chain(_seed)
            .groupBy('formatDate')
            .map(function (value, key) {
              return {
                date: key,
                total: value.length
              }
            })
            .value();
          return dates;
        }
      },
      seedCalendar: {
        type: new GraphQLList(calendarType),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {
          const _seed = await Seed.find({
            region: params.id,
            $or: [{
                $and: [{
                  isPurity: false
                }, {
                  isGerm: true
                }]
              },
              {
                $and: [{
                  isPurity: false
                }, {
                  isGerm: false
                }]
              },
              {
                $and: [{
                  isPurity: true
                }, {
                  isGerm: false
                }]
              }
            ]
          })

          console.log(_seed);
          return _seed;
        }
      },
      dueToday: {
        type: new GraphQLList(seedType),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const todaydate = moment().add(1, 'd').format('YYYY-MM-DD');

          // console.log(todaydate);

          return Seed.find({
            region: params.id,
            time: todaydate,
            $or: [{
                $and: [{
                  isPurity: false
                }, {
                  isGerm: true
                }]
              },
              {
                $and: [{
                  isPurity: false
                }, {
                  isGerm: false
                }]
              },
              {
                $and: [{
                  isPurity: true
                }, {
                  isGerm: false
                }]
              }
            ]
          }, function (err) {
            if (err) return next(err);
          });

        }
      }
    }
  }
})


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addSeed: {
        type: seedType,
        args: {
          seedcompanyid: {
            type: GraphQLNonNull(GraphQLString)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          referenceno: {
            type: GraphQLString
          },
          lotno: {
            type: GraphQLNonNull(GraphQLString)
          },
          source: {
            type: GraphQLNonNull(GraphQLString)
          },
          contact: {
            type: GraphQLNonNull(GraphQLString)
          },
          seedclass: {
            type: GraphQLNonNull(GraphQLString)
          },
          crop: {
            type: GraphQLNonNull(GraphQLString)
          },
          variety: {
            type: GraphQLNonNull(GraphQLString)
          },
          submittingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          remarks: {
            type: GraphQLString
          },
          receivingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          submittedsample: {
            type: GraphQLNonNull(GraphQLInt)
          },
          datereceived: {
            type: GraphQLNonNull(GraphQLDate)
          },
          createdon: {
            type: GraphQLDate
          },
          time: {
            type: GraphQLString
          },
          // purity: {
          //   type: GraphQLInt
          // },
          // germination: {
          //   type: GraphQLInt
          // }
        },
        resolve: function (root, params) {
          return Seed.generatereference(params, function (err, res) {
            console.log(err, res);
          });
        }
      },
      updateSeed: {
        type: seedType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString),
            name: 'id'
          },
          seedcompanyid: {
            type: GraphQLNonNull(GraphQLString)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          referenceno: {
            type: GraphQLNonNull(GraphQLString)
          },
          lotno: {
            type: GraphQLNonNull(GraphQLString)
          },
          source: {
            type: GraphQLNonNull(GraphQLString)
          },
          contact: {
            type: GraphQLNonNull(GraphQLString)
          },
          seedclass: {
            type: GraphQLNonNull(GraphQLString)
          },
          crop: {
            type: GraphQLNonNull(GraphQLString)
          },
          variety: {
            type: GraphQLNonNull(GraphQLString)
          },
          submittingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          receivingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          remarks: {
            type: GraphQLString
          },
          submittedsample: {
            type: GraphQLNonNull(GraphQLInt)
          },
          datereceived: {
            type: GraphQLNonNull(GraphQLDate)
          },
          createdon: {
            type: GraphQLNonNull(GraphQLDate)
          },
          purity: {
            type: GraphQLInt
          },
          germination: {
            type: GraphQLInt
          }
        },
        resolve: function (root, params) {
          return Seed.findOneAndUpdate({
            _id: params.id
          }, {
            seedcompanyid: params.seedcompanyid,
            region: params.region,
            referenceno: params.referenceno,
            lotno: params.lotno,
            source: params.source,
            contact: params.contact,
            seedclass: params.seedclass,
            crop: params.crop,
            variety: params.variety,
            remarks: params.remarks,
            purity: params.purity,
            germination: params.germination,
            submittingofficer: params.submittingofficer,
            receivingofficer: params.receivingofficer,
            submittedsample: params.submittedsample,
            datereceived: new Date,
            createon: new Date
          }, function (err) {
            if (err) return next(err);
          });
        }
      },
      deleteSeed: {
        type: seedType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _seed = Seed.findByIdAndRemove(params.id).exec();
          if (!_seed) {
            throw new Error('Error');
          }
          return _seed;
        }
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})