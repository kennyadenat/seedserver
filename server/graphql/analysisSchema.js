const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLDate = require('graphql-date');
const AnalysisCount = require('../models/analysiscount');




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

const query = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      analysis: {
        type: new GraphQLList(analysisType),
        resolve: function (root, args) {
          const _analysis = AnalysisCount.find().exec();
          if (!_analysis) {
            throw new Error('Error')
          }
          return _analysis;
        }
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addAnalysis: {
        type: analysisType,
        args: {

        },
        resolve: function () {

        }
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: query,
  mutation: mutation
})