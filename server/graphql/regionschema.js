const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLDate = require('graphql-date');
const Region = require('../models/region');



const regionType = new GraphQLObjectType({
  name: 'Region',
  fields: function () {
    return {
      id: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      alias: {
        type: GraphQLString
      },
      state: {
        type: GraphQLString
      },
      regionalhead: {
        type: GraphQLString
      }
    }
  }
})


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      regions: {
        type: new GraphQLList(regionType),
        resolve: function () {
          const _region = Region.find().sort('name').exec();
          if (!_region) {
            throw new Error('Error');
          }
          console.log(_region);
          return _region;
        }
      },
      region: {
        type: regionType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const _region = Region.findById(params.id).exec();
          if (!_region) {
            throw new Error('Error');
          }
          return _region;
        }
      }
    }
  }
})


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addRegion: {
        type: regionType,
        args: {
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          alias: {
            type: GraphQLNonNull(GraphQLString)
          },
          state: {
            type: GraphQLNonNull(GraphQLString)
          },
          regionalhead: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _region = new Region(params);
          const newRegion = _region.save();
          if (!newRegion) {
            throw new Error('Error');
          }
          return newRegion;
        }
      },
      updateRegion: {
        type: regionType,
        args: {
          id: {
            name: 'id',
            type: GraphQLNonNull(GraphQLString)
          },
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          alias: {
            type: GraphQLNonNull(GraphQLString)
          },
          state: {
            type: GraphQLNonNull(GraphQLString)
          },
          regionalhead: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          return Region.findOneAndUpdate({
            _id: params.id
          }, {
            name: params.name,
            alias: params.alias,
            state: params.state,
            regionalhead: params.regionalhead
          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      deleteRegion: {
        type: regionType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _region = Region.findByIdAndRemove(params.id).exec();
          if (!_region) {
            throw new Error('Error');
          }
          return _region;
        }
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})