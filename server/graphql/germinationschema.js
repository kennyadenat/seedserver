const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLBoolean = require('graphql').GraphQLBoolean;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;
const GraphQLDate = require('graphql-date');
const Germination = require('../models/germination');
const AnalysisSchema = require('../graphql/analysisSchema');
const mongoose = require('mongoose');
const Sample = require('../models/seedsample');
const AnalysisModel = require('../models/analysiscount');
const Crop = require('../models/crop');
const _ = require('underscore');


const analysisType = new GraphQLObjectType({
  name: 'AnalysisCount',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      germinationid: {
        type: GraphQLString
      },
      analysistype: {
        type: GraphQLString
      },
      score: {
        type: GraphQLInt,
      }
    }
  }
})


const analysisInputType = new GraphQLInputObjectType({
  name: 'AnalysisInputType',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      germinationid: {
        type: GraphQLString
      },
      analysistype: {
        type: GraphQLString
      },
      score: {
        type: GraphQLInt,
      }
    }
  }
})


const germinationType = new GraphQLObjectType({
  name: 'Germination',
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
      germinationpercentage: {
        type: GraphQLString
      },
      remarks: {
        type: GraphQLString
      },
      analysiscount: {
        type: new GraphQLList(analysisType)
      },
      region: {
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
})


const germinationList = new GraphQLObjectType({
  name: 'GerminationList',
  fields: function () {
    return {
      docs: {
        type: new GraphQLList(germinationType)
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


const query = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      allgermination: {
        type: germinationType,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {
          const _allCompany = await Germination.findOne({
            region: params.id
          }).exec();

          return _allCompany;
        }
      },
      admingerminations: {
        type: germinationList,
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

          if (params.search) {
            return Germination.paginate({
              referenceno: {
                $regex: new RegExp("^" + params.search.toLowerCase(), "i")
              }
            }, options, function (err, res) {
              if (err) return next(err);
              return res;
            });
          } else {
            return Germination.paginate({}, options, function (err, res) {
              if (err) return next(err);
              return res;
            });
          }


        }
      },
      germinations: {
        type: germinationList,
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

          if (params.search) {
            return Germination.paginate({
              region: params.id,
              referenceno: {
                $regex: new RegExp("^" + params.search.toLowerCase(), "i")
              }
            }, options, function (err, res) {
              if (err) return next(err);
              return res;
            });
          } else {
            return Germination.paginate({
              region: params.id
            }, options, function (err, res) {
              if (err) return next(err);
              return res;
            });
          }


        }
      },
      germination: {
        type: germinationType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          /* THis is used for one to many relationship. 
           I.e when your calling a single item and wants to pick the 
           additional models attached to it */
          const _germination = await Germination.findOne({
            _id: params.id
          }).populate({
            path: 'analysiscount',
            // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
            select: 'score _id analysistype germinationid',
            options: {
              limit: 10
            }
          }).exec();

          if (!_germination) {
            throw new Error('Error');
          }
          return _germination;
        }
      },
      searchgermination: {
        type: germinationType,
        args: {
          search: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {
          const _germination = await Germination.findOne({
            referenceno: params.search
          }).populate({
            path: 'analysiscount',
            // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
            select: 'score _id analysistype germinationid',
            options: {
              limit: 10
            }
          }).exec();

          if (_germination) {
            return _germination;
          } else {
            const newGermination = new Germination();
            const _sample = await Sample.findOne({
              referenceno: params.search
            }).exec();
            if (_sample) {
              newGermination.seedsampleid = _sample._id;
              newGermination.referenceno = _sample.referenceno;
              newGermination.region = _sample.region;
              newGermination.lotno = _sample.lotno;
              newGermination.source = _sample.source;
              newGermination.contact = _sample.contact;
              newGermination.seedclass = _sample.seedclass;
              newGermination.crop = _sample.crop;
              newGermination.variety = _sample.variety;
              datetested = new Date;
              dateevaluated = new Date;
              return newGermination;
            } else {
              return null;
            }

          }

        }
      }
    }
  }
})


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addGermination: {
        type: germinationType,
        args: {
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
          germinationpercentage: {
            type: GraphQLString
          },
          remarks: {
            type: GraphQLString
          },
          analysiscount: {
            type: new GraphQLList(analysisInputType)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          reportingofficer: {
            type: GraphQLNonNull(GraphQLString)
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
        },
        resolve: async function (root, params) {

          const exist = await Germination.findOne({
            referenceno: params.referenceno
          }).exec();

          const options = ["Hard", "Normal", "Dead", "Abnormal"];

          options.forEach(element => {
            switch (element) {
              case "Hard":
                params.hard = getAnalysisScore(params, element);
                break;
              case "Normal":
                params.normal = getAnalysisScore(params, element);
                params.germinationpercentage = params.normal;
                break;
              case "Dead":
                params.dead = getAnalysisScore(params, element);
                break;
              case "Abnormal":
                params.abnormal = getAnalysisScore(params, element);
                break;
            }
          });

          /* Calculate the Purity Remarks based on the score 
          for the calculated purity percentage */
          const crops = await Crop.findOne({
            name: params.crop
          }).exec();

          if (params.germinationpercentage >= crops.germpass) {
            params.remarks = "passed";
          } else {
            params.remarks = "failed";
          }

          updateSeedSample(params);

          /*  Check if it exists. If yes, update and 
          if no, create a new one */
          if (exist) {
            return Germination.findOneAndUpdate({
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
              normal: params.normal,
              abnormal: params.abnormal,
              hard: params.hard,
              dead: params.dead,
              germinationpercentage: params.germinationpercentage,
              remarks: params.remarks,
              region: params.region,
              reportingofficer: params.reportingofficer,
              dateevaluated: params.dateevaluated,
              datetested: params.datetested,
              createdon: params.createdon
            }, function (err) {
              // Updates the Seed Sample Detials

              params.analysiscount.forEach(element => {
                /* Check if Analysis count already exist. 
                If yes, just update and if no, create a new one */
                console.log(element);
                if (element._id != null) {
                  AnalysisModel.findOneAndUpdate({
                    _id: element._id
                  }, {
                    analysistype: element.analysistype,
                    score: element.score
                  }, function (errs) {});
                } else {
                  const analysis = new AnalysisModel({
                    germinationid: exist._id,
                    analysistype: element.analysistype,
                    score: element.score
                  })
                  analysis.save();
                  exist.analysiscount.push(analysis);
                }
              });
              return exist.save(function (err, res) {
                // return res;
              });
            })
          } else {
            const _germination = new Germination({
              _id: new mongoose.Types.ObjectId,
              seedsampleid: params.seedsampleid,
              referenceno: params.referenceno,
              lotno: params.lotno,
              crop: params.crop,
              variety: params.variety,
              source: params.source,
              contact: params.contact,
              seedclass: params.seedclass,
              normal: params.normal,
              abnormal: params.abnormal,
              hard: params.hard,
              dead: params.dead,
              germinationpercentage: params.germinationpercentage,
              remarks: params.remarks,
              region: params.region,
              reportingofficer: params.reportingofficer,
              dateevaluated: params.dateevaluated,
              datetested: params.datetested,
              createdon: params.createdon
            })

            _germination.save(function (err) {
              if (err) console.log(err);

              params.analysiscount.forEach(element => {
                const analysis = new AnalysisModel({
                  germinationid: _germination._id,
                  analysistype: element.analysistype,
                  score: element.score
                })
                analysis.save();
                _germination.analysiscount.push(analysis);
              });
              return _germination.save(function (err, res) {
                return res;
              });

            })
            return _germination;
          }
        }
      },
      updateGermination: {
        type: germinationType,
        args: {
          id: {
            name: '_id',
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
          normal: {
            type: GraphQLNonNull(GraphQLInt)
          },
          abnormal: {
            type: GraphQLNonNull(GraphQLInt)
          },
          hard: {
            type: GraphQLNonNull(GraphQLInt)
          },
          dead: {
            type: GraphQLNonNull(GraphQLInt)
          },
          germinationpercentage: {
            type: GraphQLNonNull(GraphQLString)
          },
          remarks: {
            type: GraphQLNonNull(GraphQLString)
          },
          analysiscount: {
            type: new GraphQLList(analysisInputType)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
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
          createon: {
            type: GraphQLNonNull(GraphQLDate)
          }
        },
        resolve: function () {
          return Germination.findOneAndUpdate({
            _id: params.id
          }, {

          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      deleteGermination: {
        type: germinationType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async function (root, params) {
          const _germination = await Germination.findOneAndRemove({
            _id: params.id
          }).exec();
          if (_germination) {
            _germination.analysiscount.forEach(element => {
              return AnalysisModel.findOneAndRemove({
                _id: element
              }, function (err) {})
            });
            return _germination;
          } else {
            throw new Error('Error');
          }

        }
      },
      deleteanalysis: {
        type: analysisType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _analysis = AnalysisModel.findByIdAndRemove(params.id).exec();
          if (!_analysis) {
            return null;
          }
          return _analysis;
        }
      }
    }
  }
});


function getAnalysisScore(params, element) {
  let actualScore = 0;
  const options = _.where(params.analysiscount, {
    analysistype: element
  });
  if (options.length >= 1) {
    let scores = _.pluck(options, "score");
    let count = scores.length;
    scores = scores.reduce((previous, current) => current += previous);
    scores /= count;
    actualScore = scores;
    return actualScore;
    // console.log(scores);
  } else {
    return actualScore;
  }
}

async function checkAnalysis(params, element) {
  const _check = await AnalysisModel.findById(element._id).exec();
  return _check;
}

function updateSeedSample(params) {
  Sample.findOneAndUpdate({
    referenceno: params.referenceno
  }, {
    normal: params.normal,
    abnormal: params.abnormal,
    hard: params.hard,
    dead: params.dead,
    germper: params.germinationpercentage,
    germremarks: params.remarks,
    isGerm: true
  }, function (err) {

  })
}

module.exports = new GraphQLSchema({
  query: query,
  mutation: mutation
})