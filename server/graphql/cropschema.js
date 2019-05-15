const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLBoolean = require('graphql').GraphQLBoolean;
const GraphQLDate = require('graphql-date');
const Crop = require('../models/crop');



const cropType = new GraphQLObjectType({
  name: 'Crop',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      id: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      germpass: {
        type: GraphQLInt
      },
      purpass: {
        type: GraphQLInt
      },
      time: {
        type: GraphQLInt
      },
      tag: {
        type: GraphQLString
      }
    }
  }
})


const cropList = new GraphQLObjectType({
  name: 'CropList',
  fields: function () {
    return {
      docs: {
        type: new GraphQLList(cropType)
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
      allCrop: {
        type: new GraphQLList(cropType),
        resolve: function () {
          const _crop = Crop.find().sort('name').exec();
          if (!_crop) {
            throw new Error('Error');
          }
          return _crop;
        }
      },
      crops: {
        type: cropList,
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
        resolve: function (root, params, context) {
          const options = {
            page: params.page,
            limit: params.limit,
            sort: {
              name: 1
            }
          };
          // Check if params.id is null or empty to determine the query type
          return Crop.paginate({}, options, function (err, resp) {
            if (err) return next(err);
            return resp;
          });
        }
      },
      crop: {
        type: cropType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const _crop = Crop.findById(params.id).exec();
          if (!_crop) {
            throw new Error('Error');
          }
          return _crop;
        }
      }
    }
  }
})


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addCrop: {
        type: cropType,
        args: {
          id: {
            type: GraphQLString
          },
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          germpass: {
            type: GraphQLNonNull(GraphQLInt)
          },
          purpass: {
            type: GraphQLNonNull(GraphQLInt)
          },
          time: {
            type: GraphQLNonNull(GraphQLInt)
          },
          tag: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _crop = new Crop(params);
          _crop.id = _crop._id;
          const newCrop = _crop.save();
          if (!newCrop) {
            throw new Error('Error');
          }
          return newCrop;
        }
      },
      updateCrop: {
        type: cropType,
        args: {
          _id: {
            type: GraphQLNonNull(GraphQLString)
          },
          id: {
            type: GraphQLNonNull(GraphQLString)
          },
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          germpass: {
            type: GraphQLNonNull(GraphQLInt)
          },
          purpass: {
            type: GraphQLNonNull(GraphQLInt)
          },
          time: {
            type: GraphQLNonNull(GraphQLInt)
          },
          tag: {
            type: GraphQLNonNull(GraphQLString)
          },
        },
        resolve: function (root, params) {
          return Crop.findOneAndUpdate({
            _id: params._id
          }, {
            name: params.name,
            germpass: params.germpass,
            purpass: params.purpass,
            time: params.time,
            tag: params.tag,
          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      deleteCrop: {
        type: cropType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _crop = Crop.findByIdAndRemove(params.id).exec();
          if (!_crop) {
            throw new Error('Error');
          }
          return _crop;
        }
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})