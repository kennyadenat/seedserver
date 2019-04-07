const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLDate = require('graphql-date');
const Variety = require('../models/variety');



const varietyType = new GraphQLObjectType({
  name: 'Variety',
  description: 'This is the Variety Schema',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      id: {
        type: GraphQLString
      },
      cropid: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      cropname: {
        type: GraphQLString
      }
    }
  }
});

const varietyList = new GraphQLObjectType({
  name: 'VarietyList',
  fields: function () {
    return {
      results: {
        type: new GraphQLList(varietyType)
      },
      previous: {
        type: GraphQLString
      },
      hasPrevious: {
        type: GraphQLBoolean
      },
      next: {
        type: GraphQLString
      },
      hasNext: {
        type: GraphQLBoolean
      }
    }
  }
})


const query = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      varieties: {
        type: new GraphQLList(varietyType),
        description: 'Searches for the list of varieties using crop name',
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: function (root, args) {
          return Variety.find({
            cropname: args.id
          }, function (err) {
            if (err) return next(err);
          }).sort('name')
        }
      },
      variety: {
        type: varietyType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _variety = Variety.findById(params.id).exec();
          if (!_variety) {
            throw new Error('Error');
          }
          return _variety;
        }
      },
      varietyList: {
        type: new GraphQLList(varietyType),
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          return Variety.findOne({
            cropid: params.id
          }, function (err) {
            if (err) return next(err);
          })
        }
      }
    }
  }
});


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addVariety: {
        type: varietyType,
        args: {
          cropid: {
            type: GraphQLNonNull(GraphQLString)
          },
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          cropname: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _variety = new Variety(params);
          const _newVariety = _variety.save();
          if (!_newVariety) {
            throw new Error('Error');
          }
        }
      },
      updateVariety: {
        type: varietyType,
        args: {
          id: {
            name: 'id',
            type: GraphQLNonNull(GraphQLString)
          },
          cropid: {
            type: GraphQLNonNull(GraphQLString)
          },
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          cropname: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          return Variety.findOneAndUpdate({
            _id: params.id
          }, {
            name: params.name,
            cropid: params.cropid,
            cropname: params.cropname,
          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      removeVariety: {
        type: varietyType,
        args: {},
        resolve: function (root, args) {
          const _variety = Variety.findByIdAndRemove(args.id).exec();
          if (!variety) {
            throw new Error('Error');
          }
          return _variety;
        }
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: query,
  mutation: mutation
})