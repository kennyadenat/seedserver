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
const Data = require('../queryobject/companydata')
const _ = require('underscore');



/* Defines the Company GraphQLObjectType */
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

/* Defines the Company List Item which is used for Pagination */
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


/* Defines the GraphQLObjectType for the Company State Data */
const dataCompanyState = new GraphQLObjectType({
  name: 'dataCompanyState',
  fields: function () {
    return {
      state: {
        type: GraphQLString
      },
      total: {
        type: GraphQLString
      }
    }
  }
})

/* Defines the GraphQLObjectType for the Company State Data */
const dataCompanyDate = new GraphQLObjectType({
  name: 'dataCompanyDate',
  fields: function () {
    return {
      date: {
        type: GraphQLString
      },
      total: {
        type: GraphQLString
      }
    }
  }
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      allcompany: {
        type: companyType,
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          console.log(params);

          const _allCompany = await Company.find({
            region: params.id
          }).exec();

          return _allCompany;
        }
      },
      admincompanys: {
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

          if (params.search) {
            return Company.paginate({
              name: {
                $regex: new RegExp("^" + params.search.toLowerCase(), "i")
              }
            }, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          } else {
            // Check if params.id is null or empty to determine the query type
            return Company.paginate({}, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          }
        }
      },
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

          if (params.search) {
            return Company.paginate({
              region: params.id,
              name: {
                $regex: new RegExp("^" + params.search.toLowerCase(), "i")
              }
            }, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          } else {
            // Check if params.id is null or empty to determine the query type
            return Company.paginate({
              region: params.id
            }, options, function (err, resp) {
              if (err) return next(err);
              return resp;
            });
          }
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
      },
      dataCompanyState: {
        type: new GraphQLList(dataCompanyState),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          var _company = null;

          if (params.id == 'All Regions') {
            _company = await Company.find({}).exec();
          } else {
            _company = await Company.find({
              region: params.id
            }).exec();
          }

          const views = _
            .chain(_company)
            .groupBy('state')
            .map(function (value, key) {
              return {
                state: key,
                total: value.length,
              }
            })
            .value();

          return views;
        }
      },
      dataCompanyDate: {
        type: new GraphQLList(dataCompanyDate),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: async function (root, params) {

          var _company = null;

          if (params.id == 'All Regions') {
            _company = await Company.find({}).exec();
          } else {
            _company = await Company.find({
              region: params.id
            }).exec();
          }

          var dates = _
            .chain(_company)
            .groupBy('formatDate')
            .map(function (value, key) {
              return {
                date: key,
                total: value.length
              }
            })
            .value();

          return dates;
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

          const options = {
            page: params.page,
            limit: params.limit,
            sort: {
              createon: -1
            }
          };

          const _company = new Company(params);
          const newCompany = _company.save();
          if (!newCompany) {
            throw new Error('Error');
          }
          // return Company.paginate({
          //   region: params.region
          // }, options, function (err, resp) {
          //   return resp;
          // });
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
          /* Delete the Company, The Samples and the Germination 
          and Purity if exists */
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