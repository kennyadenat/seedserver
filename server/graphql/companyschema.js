const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLBoolean = require('graphql').GraphQLBoolean;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLDate = require('graphql-date');
const Company = require('../models/seedcompany');


const companyType = new GraphQLObjectType({
  name: 'Company',
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      name: {
        type: GraphQLString,
      },
      contact: {
        type: GraphQLString,
      },
      state: {
        type: GraphQLString,
      },
      address: {
        type: GraphQLString,
      },
      phone: {
        type: GraphQLString,
      },
      region: {
        type: GraphQLString,
      },
      reportingofficer: {
        type: GraphQLString,
      },
      regionalhead: {
        type: GraphQLString,
      },
      createon: {
        type: GraphQLDate
      }
    }
  }
})


const companyList = new GraphQLObjectType({
  name: 'CompanyList',
  fields: function () {
    return {
      docs: {
        type: new GraphQLList(companyType)
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
      companys: {
        type: companyList,
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
          return Company.paginate({
            region: params.id
          }, options, function (err, resp) {
            if (err) return next(err);
            return resp;
          });
        }
      },
      company: {
        type: companyType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const _company = Company.findById(params.id).exec();
          if (!_company) {
            throw new Error('Error');
          }
          return _company;

        }
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addCompany: {
        type: companyType,
        args: {
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          contact: {
            type: GraphQLNonNull(GraphQLString)
          },
          state: {
            type: GraphQLNonNull(GraphQLString)
          },
          address: {
            type: GraphQLNonNull(GraphQLString)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          phone: {
            type: GraphQLNonNull(GraphQLString)
          },
          reportingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          regionalhead: {
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const _company = new Company(params);
          const newCompany = _company.save();
          if (!newCompany) {
            throw new Error('Error');
          }
          return newCompany;
        }
      },
      updateCompany: {
        type: companyType,
        args: {
          id: {
            name: 'id',
            type: GraphQLNonNull(GraphQLString)
          },
          name: {
            type: GraphQLNonNull(GraphQLString)
          },
          contact: {
            type: GraphQLNonNull(GraphQLString)
          },
          state: {
            type: GraphQLNonNull(GraphQLString)
          },
          address: {
            type: GraphQLNonNull(GraphQLString)
          },
          phone: {
            type: GraphQLNonNull(GraphQLString)
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          reportingofficer: {
            type: GraphQLNonNull(GraphQLString)
          },
          regionalhead: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          return Company.findOneAndUpdate({
            _id: params.id
          }, {
            name: params.name,
            contact: params.contact,
            state: params.state,
            address: params.address,
            phone: params.phone,
            region: params.region,
            reportingofficer: params.reportingofficer,
            regionalhead: params.regionalhead,
            createon: new Date
          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      removeCompany: {
        type: companyType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _company = Company.findByIdAndRemove(params.id).exec();
          if (!_company) {
            throw new Error('Error');
          }
          return _company;
        }
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})