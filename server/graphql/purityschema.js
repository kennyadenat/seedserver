const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLBoolean = require('graphql').GraphQLBoolean;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLDate = require('graphql-date');
const Purity = require('../models/purity');
const Sample = require('../models/seedsample');
const Crop = require('../models/crop');



const purityType = new GraphQLObjectType({
  name: 'purity',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      seedsampleid: {
        type: GraphQLString
      },
      referenceno: {
        type: GraphQLString
      },
      lotno: {
        type: GraphQLString
      },
      crop: {
        type: GraphQLString
      },
      variety: {
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
      purityscorekg: {
        type: GraphQLInt
      },
      purityscoreper: {
        type: GraphQLInt
      },
      innertscorekg: {
        type: GraphQLInt
      },
      innertscoreper: {
        type: GraphQLInt
      },
      region: {
        type: GraphQLString
      },
      remarks: {
        type: GraphQLString
      },
      reportingofficer: {
        type: GraphQLString
      },
      dateevaluated: {
        type: GraphQLDate
      },
      datetested: {
        type: GraphQLDate
      },
      createdon: {
        type: GraphQLDate
      }
    }
  }
});


const purityList = new GraphQLObjectType({
  name: 'PurityList',
  fields: function () {
    return {
      docs: {
        type: new GraphQLList(purityType)
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

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      adminpuritys: {
        type: purityList,
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
              createdon: -1
            }
          };
          if (params.search) {
            // Check if params.id is null or empty to determine the query type
            return Purity.paginate({
              referenceno: {
                $regex: new RegExp("^" + params.search.toLowerCase(), "i")
              }
            }, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          } else {
            // Check if params.id is null or empty to determine the query type
            return Purity.paginate({}, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          }

        }
      },
      puritys: {
        type: purityList,
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
              createdon: -1
            }
          };
          if (params.search) {
            // Check if params.id is null or empty to determine the query type
            return Purity.paginate({
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
            return Purity.paginate({
              region: params.id
            }, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          }

        }
      },
      purity: {
        type: purityType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const _purity = Purity.findById(params.id).exec()
          if (!_purity) {
            throw new Error('Error');
          }
          return _purity;
        }
      },
      searchpurity: {
        type: purityType,
        args: {
          search: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params, pres) {

          console.log(params);
          const _purity = await Purity.findOne({
            referenceno: params.search
          }).exec();

          console.log(_purity);

          if (_purity) {
            return _purity;
          } else {
            const newPurity = new Purity();
            const _sample = await Sample.findOne({
              referenceno: params.search
            }).exec();
            if (_sample) {
              newPurity.seedsampleid = _sample._id;
              newPurity.referenceno = _sample.referenceno;
              newPurity.region = _sample.region;
              newPurity.lotno = _sample.lotno;
              newPurity.source = _sample.source;
              newPurity.contact = _sample.contact;
              newPurity.seedclass = _sample.seedclass;
              newPurity.crop = _sample.crop;
              newPurity.variety = _sample.variety;
              datetested = new Date;
              dateevaluated = new Date;
              return newPurity;
            } else {
              return null;
            }

          }

        }
      }
    }
  }
});


const mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: function () {
    return {
      addPurity: {
        type: purityType,
        args: {
          _id: {
            type: GraphQLString
          },
          seedsampleid: {
            type: GraphQLNonNull(GraphQLString)
          },
          referenceno: {
            type: GraphQLNonNull(GraphQLString)
          },
          lotno: {
            type: GraphQLNonNull(GraphQLString)
          },
          crop: {
            type: GraphQLNonNull(GraphQLString)
          },
          variety: {
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
          purityscorekg: {
            type: GraphQLNonNull(GraphQLInt)
          },
          purityscoreper: {
            type: GraphQLNonNull(GraphQLInt)
          },
          innertscorekg: {
            type: GraphQLNonNull(GraphQLInt)
          },
          innertscoreper: {
            type: GraphQLNonNull(GraphQLInt)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          remarks: {
            type: GraphQLString
          },
          reportingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          dateevaluated: {
            type: GraphQLNonNull(GraphQLDate)
          },
          datetested: {
            type: GraphQLNonNull(GraphQLDate)
          },
          createdon: {
            type: GraphQLDate
          }
        },
        resolve: async function (root, params) {
          /* search if purity already exist. if yes, update and 
          if Notification, create new one */
          const exist = await Purity.findOne({
            referenceno: params.referenceno
          }).exec();

          /* Calculate the Purity Remarks based on the score 
          for the calculated purity percentage */
          const crops = await Crop.findOne({
            name: params.crop
          }).exec();

          if (params.purityscoreper >= crops.purpass) {
            params.remarks = "passed";
          } else {
            params.remarks = "failed";
          }

          if (exist) {
            return Purity.findOneAndUpdate({
              referenceno: params.referenceno
            }, {
              seedsampleid: params.seedsampleid,
              referenceno: params.referenceno,
              lotno: params.lotno,
              crop: params.crop,
              variety: params.variety,
              source: params.source,
              contact: params.contact,
              seedclass: params.seedclass,
              purityscorekg: params.purityscorekg,
              purityscoreper: params.purityscoreper,
              innertscorekg: params.innertscorekg,
              innertscoreper: params.innertscoreper,
              region: params.region,
              remarks: params.remarks,
              reportingofficer: params.reportingofficer,
              dateevaluated: params.dateevaluated,
              datetested: params.datetested,
            }, function (err) {
              if (err) return next(err);
              updateSeedSample(params);
            });
          } else {

            const _purity = new Purity(params);
            const newPurity = _purity.save();
            if (!newPurity) {
              throw new Error('Error');
            }
            updateSeedSample(newPurity);
            return newPurity;
          }
        }
      },
      updatePurity: {
        type: purityType,
        args: {
          id: {
            name: 'id',
            type: GraphQLNonNull(GraphQLString)
          },
          seedsampleid: {
            type: GraphQLNonNull(GraphQLString)
          },
          referenceno: {
            type: GraphQLNonNull(GraphQLString)
          },
          lotno: {
            type: GraphQLNonNull(GraphQLString)
          },
          crop: {
            type: GraphQLNonNull(GraphQLString)
          },
          variety: {
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
          purityscorekg: {
            type: GraphQLNonNull(GraphQLInt)
          },
          purityscoreper: {
            type: GraphQLNonNull(GraphQLInt)
          },
          innertscorekg: {
            type: GraphQLNonNull(GraphQLInt)
          },
          innertscoreper: {
            type: GraphQLNonNull(GraphQLInt)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          remarks: {
            type: GraphQLString
          },
          reportingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          dateevaluated: {
            type: GraphQLNonNull(GraphQLDate)
          },
          datetested: {
            type: GraphQLNonNull(GraphQLDate)
          },
          createdon: {
            type: GraphQLDate
          }
        },
        resolve: function (root, params) {
          return Purity.findOneAndUpdate({
            _id: params.id
          }, {
            seedsampleid: params.seedsampleid,
            referenceno: params.referenceno,
            lotno: params.lotno,
            crop: params.crop,
            variety: params.variety,
            source: params.source,
            contact: params.contact,
            seedclass: params.seedclass,
            purityscorekg: params.purityscorekg,
            purityscoreper: params.purityscoreper,
            innertscorekg: params.innertscorekg,
            innertscoreper: params.innertscoreper,
            region: params.region,
            remarks: params.remarks,
            reportingofficer: params.reportingofficer,
            dateevaluated: params.dateevaluated,
            datetested: params.datetested,
            createon: new Date
          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      deletePurity: {
        type: purityType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async function (root, params) {
          const _purity = await Purity.findOneAndRemove({
            _id: params.id
          }).exec();
          if (!_purity) {
            throw new Error('Error')
          }
          return _purity;
        }
      }
    }
  }
})

function calculateRemarks(params) {
  let remarks = "failed";
  Crop.findOne({
    name: params.crop
  }, function (err, res) {
    if (params.purityscoreper >= res.purpass) {
      remarks = "passed";
      return remarks;
    } else {
      return remarks;
    }
  })
}

function updateSeedSample(params) {
  Sample.findOneAndUpdate({
    referenceno: params.referenceno
  }, {
    puritykg: params.purityscorekg,
    purityper: params.purityscoreper,
    purityremarks: params.remarks
  }, function (err) {

  })
}

module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})