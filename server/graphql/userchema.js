const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLBoolean = require('graphql').GraphQLBoolean;
const GraphQLInt = require('graphql').GraphQLInt;
const GraphQLFloat = require('graphql').GraphQLFloat;
const GraphQLDate = require('graphql-date');
const AuthenticationError = require('apollo-server').AuthenticationError;
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const Config = require('../config/key');


const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    fullname: {
      type: GraphQLString
    },
    firstname: {
      type: GraphQLString
    },
    lastname: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString
    },
    region: {
      type: GraphQLString
    },
    role: {
      type: GraphQLString
    },
    token: {
      type: GraphQLString
    },
    staffrole: {
      type: GraphQLString
    },
    hash: {
      type: GraphQLString
    },
    salt: {
      type: GraphQLString
    },
    createdon: {
      type: GraphQLDate
    }
  })
});



const userList = new GraphQLObjectType({
  name: 'UserList',
  fields: function () {
    return {
      docs: {
        type: new GraphQLList(userType)
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
      users: {
        type: userList,
        args: {
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
              email: 1
            }
          };

          return User.paginate({
            role: "Staff",
            staffrole: "Seed Analyst"
          }, options, function (err, result) {
            return result;
          });
        }
      },
      certusers: {
        type: userList,
        args: {
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
              email: 1
            }
          };

          return User.paginate({
            role: "Staff",
            staffrole: "Seed Certification"
          }, options, function (err, result) {
            return result;
          });

        }
      },
      allcertusers: {
        type: userList,
        resolve: async function (root, params) {
          const _crop = await User.find().sort('firstname').exec();
          if (!_crop) {
            throw new Error('Error');
          }
          return _crop;

        }
      },
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _user = User.findById(params.id).exec();
          if (!_user) {
            throw new Error('Error');
          }
          return _user;
        }
      },
      regionusers: {
        type: new GraphQLList(userType),
        args: {
          id: {
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const _users = User.find({
            region: params.id,
            staffrole: 'Seed Analyst'
          }).exec();
          if (!_users) {
            throw new Error('Error');
          }
          return _users;
        }
      }
    }
  }
});


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      createanalyst: {
        type: userType,
        args: {
          email: {
            type: GraphQLNonNull(GraphQLString)
          },
          firstname: {
            type: GraphQLNonNull(GraphQLString)
          },
          lastname: {
            type: GraphQLNonNull(GraphQLString)
          },
          phone: {
            type: GraphQLNonNull(GraphQLString)
          },
          image: {
            type: GraphQLString
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          role: {
            type: GraphQLNonNull(GraphQLString)
          },
          staffid: {
            type: GraphQLNonNull(GraphQLString)
          },
          staffrole: {
            type: GraphQLNonNull(GraphQLString)
          },
          hash: {
            type: GraphQLString
          },
          salt: {
            type: GraphQLString
          },
        },
        resolve: function (root, params) {
          const newUser = new User(params);
          const newAnalyst = newUser.save();
          if (!newAnalyst) {
            console.log(newAnalyst);
            throw new Error('Error');
          }
          return newAnalyst;
        }
      },
      signin: {
        type: userType,
        args: {
          email: {
            type: GraphQLNonNull(GraphQLString)
          },
          password: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          return User.authentication(params, function (err) {
            throw new Error(err);
          });
        }
      },
      removeuser: {
        type: userType,
        args: {
          id: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {
          const _users = User.findByIdAndDelete().exec();
          if (!_users) {
            throw new Error('Error');
          }
          return _users;
        }
      },
      updateuser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: GraphQLNonNull(GraphQLString)
          },
          email: {
            type: GraphQLNonNull(GraphQLString)
          },
          firstname: {
            type: GraphQLNonNull(GraphQLString)
          },
          lastname: {
            type: GraphQLNonNull(GraphQLString)
          },
          phone: {
            type: GraphQLNonNull(GraphQLString)
          },
          image: {
            type: GraphQLString
          },
          region: {
            type: GraphQLNonNull(GraphQLString)
          },
          role: {
            type: GraphQLNonNull(GraphQLString)
          },
          staffid: {
            type: GraphQLNonNull(GraphQLString)
          },
          staffrole: {
            type: GraphQLNonNull(GraphQLString)
          },
          hash: {
            type: GraphQLString
          },
          salt: {
            type: GraphQLString
          },
        },
        resolve: function (root, params) {
          return User.findOne({
            _id: params.id
          }, {
            email: params.email,
            firstname: params.firstname,
            lastname: params.lastname,
            phone: params.phone,
            image: params.image,
            region: params.region,
            role: params.role,
            staffid: params.staffid,
            staffrole: params.staffrole
          }, function (err) {
            if (err) return next(err);
          })
        }
      },
      changepassword: {
        type: userType,
        args: {
          email: {
            type: GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function (root, params) {

        }
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation
})