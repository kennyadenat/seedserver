const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;


// const companyState = new GraphQLObjectType({
//   name: 'dataCompanyState',
//   fields: function () {
//     return {
//       state: {
//         type: GraphQLString
//       },
//       count: {
//         type: GraphQLString
//       }
//     }
//   }
// })

module.exports = new GraphQLObjectType({
  name: 'dataCompanyState',
  fields: function () {
    return {
      state: {
        type: GraphQLString
      },
      count: {
        type: GraphQLString
      }
    }
  }
})