// const MongoPagination = require('mongo-cursor-pagination');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator")
const crypto = require("crypto")
const jwt = require("jsonwebtoken");
const authTypes = ['github', 'twitter', 'facebook', 'google'];
const mongoosePaginate = require('mongoose-paginate-v2');
const Config = require('../config/key');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "email cannot be empty"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true
  },
  firstname: {
    type: String,
    required: [true, "firstname cannot be empty"]
  },
  lastname: {
    type: String,
    required: [true, "lastname cannot be empty"]
  },
  phone: {
    type: String,
    required: [true, "phone number cannot be empty"]
  },
  image: String,
  region: String,
  role: String,
  staffrole: String,
  token: String,
  hash: String,
  salt: String,
  createdon: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

UserSchema.plugin(mongoosePaginate);

// UserSchema.plugin(MongoPagination.mongoosePlugin, {
//   name: 'paginateFN'
// });

UserSchema.plugin(uniqueValidator, {
  message: "is already taken"
})


UserSchema.methods.setPassword = function (staffid) {
  this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(staffid, this.salt);
};

UserSchema.methods.validPassword = function (oldPass, newPass) {
  const hash = crypto
    .pbkdf2Sync(oldPass, newPass, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000)
    },
    Config.secret);
};

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    firstname: this.firstname,
    lastname: this.lastname,
    phone: this.phone,
    token: "Bearer " + this.generateJWT(),
    region: this.region,
    role: this.role,
    staffrole: this.staffrole
  };
};

UserSchema.virtual('staffid').set(function (staffid) {
  this.salt = staffid;
  this.setPassword(staffid);
}).get(function () {
  return this._password;
});

UserSchema.virtual('fullname').get(function () {
  const fullnames = this.firstname + " " + this.lastname;
  return fullnames;
})

UserSchema.statics.authentication = async function (users) {
  const Users = await User.findOne({
    email: users.email
  });
  if (!Users) {
    throw new Error('Invalid Username');
  } else {
    const verify = bcrypt.compareSync(users.password, Users.hash);
    if (verify) {
      return Users.toAuthJSON();
    } else {
      throw new Error('Password do not match');
    }
  }
  //Validate the Users

};


const User = module.exports = mongoose.model('users', UserSchema);

module.exports.signUser = function (newUser, password, cb) {
  bcrypt.compare(password, newUser.hash, function (err, res) {
    cb(null, res);
  });
};