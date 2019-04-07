const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLDate = require('graphql-date');
const State = require('../models/state');


const stateType = new GraphQLObjectType({
  name: 'State',
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
      states: {
        type: new GraphQLList(stateType),
        resolve: function () {
          const _states = State.find().sort('name').exec();
          if (!_states) {
            throw new Error('Error');
          }
          return _states;
        }
      },
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addState: {
        type: stateType,
        args: {},
        resolve: function (root, params) {

        }
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})