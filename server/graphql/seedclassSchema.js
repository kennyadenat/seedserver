const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLDate = require('graphql-date');
const SeedClass = require('../models/seedclass');


const seedclassType = new GraphQLObjectType({
  name: 'SeedClass',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      }
    }
  }
});


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      seedclass: {
        type: new GraphQLList(seedclassType),
        resolve: function () {
          const _seedclass = SeedClass.find().sort('name').exec();
          if (!_seedclass) {
            throw new Error('Error');
          }
          return _seedclass;
        }
      },
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addSeedClass: {
        type: seedclassType,
        args: {
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
        },
        resolve: function (root, params) {
          const _seedclass = new SeedClass(params);
          const newSeedClass = _seedclass.save();
          if (!newSeedClass) {
            throw new Error('Error');
          }
          return newSeedClass;
        }
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})